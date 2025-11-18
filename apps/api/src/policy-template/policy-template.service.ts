import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePolicyTemplateDto,
  UpdatePolicyTemplateDto,
  PolicyTemplateQueryDto,
} from '@insurance-platform/shared';

@Injectable()
export class PolicyTemplateService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreatePolicyTemplateDto) {
    return this.prisma.policyTemplate.create({
      data: {
        tenantId,
        createdById: userId,
        name: dto.name,
        description: dto.description,
        facilityTypes: dto.facilityTypes,
        coverageConfig: dto.coverageConfig,
        premiumFormula: dto.premiumFormula,
        underwritingRules: dto.underwritingRules,
        isPublic: dto.isPublic || false,
      },
    });
  }

  async findAll(tenantId: string, query: PolicyTemplateQueryDto) {
    const {
      facilityType,
      isActive = true,
      isPublic,
      search,
      page = 1,
      limit = 20,
    } = query;

    const where: any = {
      OR: [
        { tenantId },
        { isPublic: true },
      ],
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (facilityType) {
      where.facilityTypes = {
        has: facilityType,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      this.prisma.policyTemplate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.policyTemplate.count({ where }),
    ]);

    return {
      data: templates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, tenantId: string) {
    const template = await this.prisma.policyTemplate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Policy template not found');
    }

    // Check access: either template belongs to tenant or is public
    if (template.tenantId !== tenantId && !template.isPublic) {
      throw new ForbiddenException('Access denied to this policy template');
    }

    return template;
  }

  async update(id: string, tenantId: string, dto: UpdatePolicyTemplateDto) {
    const template = await this.prisma.policyTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Policy template not found');
    }

    // Only allow updates to templates owned by the tenant
    if (template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot update templates from other tenants');
    }

    return this.prisma.policyTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, tenantId: string) {
    const template = await this.prisma.policyTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Policy template not found');
    }

    if (template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot delete templates from other tenants');
    }

    // Soft delete by setting isActive to false
    return this.prisma.policyTemplate.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async duplicate(id: string, tenantId: string, userId: string) {
    const template = await this.findOne(id, tenantId);

    return this.prisma.policyTemplate.create({
      data: {
        tenantId,
        createdById: userId,
        name: `${template.name} (Copy)`,
        description: template.description,
        facilityTypes: template.facilityTypes,
        coverageConfig: template.coverageConfig,
        premiumFormula: template.premiumFormula,
        underwritingRules: template.underwritingRules,
        isPublic: false,
        version: 1,
      },
    });
  }

  async createVersion(id: string, tenantId: string, userId: string) {
    const template = await this.findOne(id, tenantId);

    if (template.tenantId !== tenantId) {
      throw new ForbiddenException('Cannot create version of templates from other tenants');
    }

    return this.prisma.policyTemplate.create({
      data: {
        tenantId,
        createdById: userId,
        name: template.name,
        description: template.description,
        facilityTypes: template.facilityTypes,
        coverageConfig: template.coverageConfig,
        premiumFormula: template.premiumFormula,
        underwritingRules: template.underwritingRules,
        isPublic: template.isPublic,
        version: template.version + 1,
      },
    });
  }
}
