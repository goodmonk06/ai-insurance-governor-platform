import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PolicyTemplateService } from './policy-template.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PolicyTemplateService', () => {
  let service: PolicyTemplateService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    policyTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockTemplate = {
    id: 'template-1',
    tenantId: 'tenant-1',
    name: 'Standard Nursing Home Insurance',
    description: 'Comprehensive coverage for nursing homes',
    facilityTypes: ['nursing_home'],
    coverageConfig: { liability: 1000000 },
    premiumFormula: { baseRate: 0.05 },
    underwritingRules: { minBedCount: 10 },
    isActive: true,
    isPublic: false,
    version: 1,
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyTemplateService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PolicyTemplateService>(PolicyTemplateService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new policy template', async () => {
      const createDto = {
        name: 'New Template',
        description: 'Test description',
        facilityTypes: ['nursing_home'],
        coverageConfig: {},
        premiumFormula: {},
        underwritingRules: {},
        isPublic: false,
      };

      mockPrismaService.policyTemplate.create.mockResolvedValue(mockTemplate);

      const result = await service.create('tenant-1', 'user-1', createDto);

      expect(result).toEqual(mockTemplate);
      expect(mockPrismaService.policyTemplate.create).toHaveBeenCalledWith({
        data: {
          tenantId: 'tenant-1',
          createdById: 'user-1',
          name: createDto.name,
          description: createDto.description,
          facilityTypes: createDto.facilityTypes,
          coverageConfig: createDto.coverageConfig,
          premiumFormula: createDto.premiumFormula,
          underwritingRules: createDto.underwritingRules,
          isPublic: createDto.isPublic,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated templates', async () => {
      const templates = [mockTemplate];
      mockPrismaService.policyTemplate.findMany.mockResolvedValue(templates);
      mockPrismaService.policyTemplate.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', { page: 1, limit: 20 });

      expect(result).toEqual({
        data: templates,
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should filter by facility type', async () => {
      mockPrismaService.policyTemplate.findMany.mockResolvedValue([mockTemplate]);
      mockPrismaService.policyTemplate.count.mockResolvedValue(1);

      await service.findAll('tenant-1', { facilityType: 'nursing_home' });

      expect(mockPrismaService.policyTemplate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            facilityTypes: { has: 'nursing_home' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a template if it belongs to the tenant', async () => {
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(mockTemplate);

      const result = await service.findOne('template-1', 'tenant-1');

      expect(result).toEqual(mockTemplate);
    });

    it('should return a public template even if it belongs to another tenant', async () => {
      const publicTemplate = { ...mockTemplate, tenantId: 'tenant-2', isPublic: true };
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(publicTemplate);

      const result = await service.findOne('template-1', 'tenant-1');

      expect(result).toEqual(publicTemplate);
    });

    it('should throw NotFoundException if template does not exist', async () => {
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent', 'tenant-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if template is private and belongs to another tenant', async () => {
      const privateTemplate = { ...mockTemplate, tenantId: 'tenant-2', isPublic: false };
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(privateTemplate);

      await expect(service.findOne('template-1', 'tenant-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a template owned by the tenant', async () => {
      const updateDto = { name: 'Updated Name' };
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(mockTemplate);
      mockPrismaService.policyTemplate.update.mockResolvedValue({
        ...mockTemplate,
        ...updateDto,
      });

      const result = await service.update('template-1', 'tenant-1', updateDto);

      expect(result.name).toEqual('Updated Name');
    });

    it('should throw ForbiddenException when updating template from another tenant', async () => {
      const otherTemplate = { ...mockTemplate, tenantId: 'tenant-2' };
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(otherTemplate);

      await expect(
        service.update('template-1', 'tenant-1', { name: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should soft delete a template by setting isActive to false', async () => {
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(mockTemplate);
      mockPrismaService.policyTemplate.update.mockResolvedValue({
        ...mockTemplate,
        isActive: false,
      });

      const result = await service.remove('template-1', 'tenant-1');

      expect(result.isActive).toBe(false);
      expect(mockPrismaService.policyTemplate.update).toHaveBeenCalledWith({
        where: { id: 'template-1' },
        data: { isActive: false },
      });
    });

    it('should throw ForbiddenException when deleting template from another tenant', async () => {
      const otherTemplate = { ...mockTemplate, tenantId: 'tenant-2' };
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(otherTemplate);

      await expect(service.remove('template-1', 'tenant-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('duplicate', () => {
    it('should create a copy of an existing template', async () => {
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        createdBy: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      });
      mockPrismaService.policyTemplate.create.mockResolvedValue({
        ...mockTemplate,
        id: 'template-2',
        name: 'Standard Nursing Home Insurance (Copy)',
      });

      const result = await service.duplicate('template-1', 'tenant-1', 'user-2');

      expect(result.name).toContain('(Copy)');
      expect(mockPrismaService.policyTemplate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: expect.stringContaining('(Copy)'),
            version: 1,
          }),
        }),
      );
    });
  });

  describe('createVersion', () => {
    it('should create a new version of an existing template', async () => {
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        createdBy: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      });
      mockPrismaService.policyTemplate.create.mockResolvedValue({
        ...mockTemplate,
        id: 'template-2',
        version: 2,
      });

      const result = await service.createVersion('template-1', 'tenant-1', 'user-1');

      expect(result.version).toBe(2);
      expect(mockPrismaService.policyTemplate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            version: 2,
          }),
        }),
      );
    });

    it('should throw ForbiddenException when versioning template from another tenant', async () => {
      const otherTemplate = {
        ...mockTemplate,
        tenantId: 'tenant-2',
        createdBy: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      };
      mockPrismaService.policyTemplate.findUnique.mockResolvedValue(otherTemplate);

      await expect(
        service.createVersion('template-1', 'tenant-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
