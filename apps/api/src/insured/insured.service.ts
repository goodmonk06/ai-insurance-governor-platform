import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsuredDto, UpdateInsuredDto } from '@insurance-platform/shared';

@Injectable()
export class InsuredService {
  constructor(private prisma: PrismaService) {}

  async findByTenant(tenantId: string) {
    return this.prisma.insuredEntity.findMany({
      where: { tenantId },
      include: {
        policies: {
          where: { status: 'active' },
        },
        riskAssessments: {
          orderBy: { assessedAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.insuredEntity.findUnique({
      where: { id },
      include: {
        policies: true,
        riskAssessments: {
          orderBy: { assessedAt: 'desc' },
        },
        quoteRequests: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(tenantId: string, data: CreateInsuredDto) {
    return this.prisma.insuredEntity.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: UpdateInsuredDto) {
    return this.prisma.insuredEntity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.insuredEntity.delete({
      where: { id },
    });
  }
}
