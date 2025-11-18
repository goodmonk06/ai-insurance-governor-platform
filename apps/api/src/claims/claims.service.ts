import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateClaimDto,
  UpdateClaimDto,
  ReviewClaimDto,
  ClaimQueryDto,
  ClaimStatus,
} from '@insurance-platform/shared';

@Injectable()
export class ClaimsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateClaimDto) {
    // Verify policy exists and belongs to tenant
    const policy = await this.prisma.policy.findFirst({
      where: {
        id: dto.policyId,
        tenantId,
      },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    // Verify insured entity matches policy
    if (policy.insuredEntityId !== dto.insuredEntityId) {
      throw new BadRequestException('Insured entity does not match policy');
    }

    // Check if policy is active
    if (policy.status !== 'active') {
      throw new BadRequestException('Cannot create claim for inactive policy');
    }

    // Generate unique claim number
    const claimNumber = await this.generateClaimNumber(tenantId);

    return this.prisma.claim.create({
      data: {
        tenantId,
        policyId: dto.policyId,
        insuredEntityId: dto.insuredEntityId,
        claimNumber,
        claimType: dto.claimType,
        status: ClaimStatus.SUBMITTED,
        incidentDate: dto.incidentDate,
        description: dto.description,
        claimedAmount: dto.claimedAmount,
        adjusterNotes: [],
      },
      include: {
        policy: true,
        insuredEntity: true,
      },
    });
  }

  async findAll(tenantId: string, query: ClaimQueryDto) {
    const {
      policyId,
      insuredEntityId,
      status,
      claimType,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 20,
    } = query;

    const where: any = { tenantId };

    if (policyId) {
      where.policyId = policyId;
    }

    if (insuredEntityId) {
      where.insuredEntityId = insuredEntityId;
    }

    if (status) {
      where.status = status;
    }

    if (claimType) {
      where.claimType = claimType;
    }

    if (fromDate || toDate) {
      where.incidentDate = {};
      if (fromDate) {
        where.incidentDate.gte = fromDate;
      }
      if (toDate) {
        where.incidentDate.lte = toDate;
      }
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.claimedAmount = {};
      if (minAmount !== undefined) {
        where.claimedAmount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.claimedAmount.lte = maxAmount;
      }
    }

    const [claims, total] = await Promise.all([
      this.prisma.claim.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { reportedDate: 'desc' },
        include: {
          policy: {
            select: {
              policyNumber: true,
              productName: true,
            },
          },
          insuredEntity: {
            select: {
              name: true,
              type: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.claim.count({ where }),
    ]);

    return {
      data: claims,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, tenantId: string) {
    const claim = await this.prisma.claim.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        policy: true,
        insuredEntity: true,
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return claim;
  }

  async update(id: string, tenantId: string, dto: UpdateClaimDto) {
    const claim = await this.findOne(id, tenantId);

    // Prevent updates to closed claims
    if (claim.status === ClaimStatus.CLOSED) {
      throw new BadRequestException('Cannot update closed claim');
    }

    return this.prisma.claim.update({
      where: { id },
      data: dto,
      include: {
        policy: true,
        insuredEntity: true,
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async review(id: string, tenantId: string, userId: string, dto: ReviewClaimDto) {
    const claim = await this.findOne(id, tenantId);

    // Can only review claims that are submitted or under review
    if (![ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW].includes(claim.status as ClaimStatus)) {
      throw new BadRequestException(`Cannot review claim with status: ${claim.status}`);
    }

    // Validate approved amount if status is approved
    if (dto.status === ClaimStatus.APPROVED && !dto.approvedAmount) {
      throw new BadRequestException('Approved amount is required when approving claim');
    }

    // Validate denial reason if status is denied
    if (dto.status === ClaimStatus.DENIED && !dto.denialReason) {
      throw new BadRequestException('Denial reason is required when denying claim');
    }

    return this.prisma.claim.update({
      where: { id },
      data: {
        status: dto.status,
        approvedAmount: dto.approvedAmount,
        denialReason: dto.denialReason,
        adjusterNotes: dto.adjusterNotes,
        reviewedById: userId,
        reviewedAt: new Date(),
      },
      include: {
        policy: true,
        insuredEntity: true,
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async processPayment(id: string, tenantId: string, paidAmount: number) {
    const claim = await this.findOne(id, tenantId);

    // Can only pay approved claims
    if (claim.status !== ClaimStatus.APPROVED) {
      throw new BadRequestException('Can only process payment for approved claims');
    }

    // Validate paid amount
    if (paidAmount > (claim.approvedAmount || 0)) {
      throw new BadRequestException('Paid amount cannot exceed approved amount');
    }

    return this.prisma.claim.update({
      where: { id },
      data: {
        paidAmount,
        status: ClaimStatus.PAID,
      },
      include: {
        policy: true,
        insuredEntity: true,
      },
    });
  }

  async close(id: string, tenantId: string) {
    const claim = await this.findOne(id, tenantId);

    // Can only close paid or denied claims
    if (![ClaimStatus.PAID, ClaimStatus.DENIED].includes(claim.status as ClaimStatus)) {
      throw new BadRequestException('Can only close paid or denied claims');
    }

    return this.prisma.claim.update({
      where: { id },
      data: {
        status: ClaimStatus.CLOSED,
        closedAt: new Date(),
      },
    });
  }

  async getStatistics(tenantId: string, fromDate?: Date, toDate?: Date) {
    const where: any = { tenantId };

    if (fromDate || toDate) {
      where.reportedDate = {};
      if (fromDate) {
        where.reportedDate.gte = fromDate;
      }
      if (toDate) {
        where.reportedDate.lte = toDate;
      }
    }

    const [
      totalClaims,
      claimsByStatus,
      claimsByType,
      totalClaimedAmount,
      totalApprovedAmount,
      totalPaidAmount,
    ] = await Promise.all([
      this.prisma.claim.count({ where }),
      this.prisma.claim.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.claim.groupBy({
        by: ['claimType'],
        where,
        _count: true,
      }),
      this.prisma.claim.aggregate({
        where,
        _sum: { claimedAmount: true },
      }),
      this.prisma.claim.aggregate({
        where,
        _sum: { approvedAmount: true },
      }),
      this.prisma.claim.aggregate({
        where,
        _sum: { paidAmount: true },
      }),
    ]);

    return {
      totalClaims,
      byStatus: claimsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byType: claimsByType.reduce((acc, item) => {
        acc[item.claimType] = item._count;
        return acc;
      }, {} as Record<string, number>),
      totalClaimedAmount: totalClaimedAmount._sum.claimedAmount || 0,
      totalApprovedAmount: totalApprovedAmount._sum.approvedAmount || 0,
      totalPaidAmount: totalPaidAmount._sum.paidAmount || 0,
    };
  }

  private async generateClaimNumber(tenantId: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Count claims this month for sequence number
    const count = await this.prisma.claim.count({
      where: {
        tenantId,
        reportedDate: {
          gte: new Date(year, now.getMonth(), 1),
          lt: new Date(year, now.getMonth() + 1, 1),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `CLM-${year}${month}-${sequence}`;
  }
}
