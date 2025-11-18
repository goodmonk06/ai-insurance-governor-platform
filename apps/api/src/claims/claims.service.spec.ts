import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClaimStatus, ClaimType } from '@insurance-platform/shared';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    policy: {
      findFirst: jest.fn(),
    },
    claim: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  const mockPolicy = {
    id: 'policy-1',
    tenantId: 'tenant-1',
    insuredEntityId: 'entity-1',
    policyNumber: 'POL-2024-001',
    status: 'active',
    productName: 'Standard Coverage',
  };

  const mockClaim = {
    id: 'claim-1',
    tenantId: 'tenant-1',
    policyId: 'policy-1',
    insuredEntityId: 'entity-1',
    claimNumber: 'CLM-202401-0001',
    claimType: ClaimType.PROPERTY_DAMAGE,
    status: ClaimStatus.SUBMITTED,
    incidentDate: new Date('2024-01-15'),
    reportedDate: new Date('2024-01-16'),
    description: 'Fire damage to property',
    claimedAmount: 50000,
    adjusterNotes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      policyId: 'policy-1',
      insuredEntityId: 'entity-1',
      claimType: ClaimType.PROPERTY_DAMAGE,
      incidentDate: new Date('2024-01-15'),
      description: 'Fire damage',
      claimedAmount: 50000,
    };

    it('should create a new claim', async () => {
      mockPrismaService.policy.findFirst.mockResolvedValue(mockPolicy);
      mockPrismaService.claim.count.mockResolvedValue(0);
      mockPrismaService.claim.create.mockResolvedValue(mockClaim);

      const result = await service.create('tenant-1', createDto);

      expect(result).toEqual(mockClaim);
      expect(mockPrismaService.claim.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: 'tenant-1',
            status: ClaimStatus.SUBMITTED,
            claimType: createDto.claimType,
          }),
        }),
      );
    });

    it('should throw NotFoundException if policy not found', async () => {
      mockPrismaService.policy.findFirst.mockResolvedValue(null);

      await expect(service.create('tenant-1', createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insured entity does not match policy', async () => {
      const invalidDto = { ...createDto, insuredEntityId: 'wrong-entity' };
      mockPrismaService.policy.findFirst.mockResolvedValue(mockPolicy);

      await expect(service.create('tenant-1', invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if policy is not active', async () => {
      const inactivePolicy = { ...mockPolicy, status: 'expired' };
      mockPrismaService.policy.findFirst.mockResolvedValue(inactivePolicy);

      await expect(service.create('tenant-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated claims', async () => {
      const claims = [mockClaim];
      mockPrismaService.claim.findMany.mockResolvedValue(claims);
      mockPrismaService.claim.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', { page: 1, limit: 20 });

      expect(result).toEqual({
        data: claims,
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should filter by status', async () => {
      mockPrismaService.claim.findMany.mockResolvedValue([mockClaim]);
      mockPrismaService.claim.count.mockResolvedValue(1);

      await service.findAll('tenant-1', { status: ClaimStatus.SUBMITTED });

      expect(mockPrismaService.claim.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ClaimStatus.SUBMITTED,
          }),
        }),
      );
    });

    it('should filter by date range', async () => {
      const fromDate = new Date('2024-01-01');
      const toDate = new Date('2024-12-31');
      mockPrismaService.claim.findMany.mockResolvedValue([]);
      mockPrismaService.claim.count.mockResolvedValue(0);

      await service.findAll('tenant-1', { fromDate, toDate });

      expect(mockPrismaService.claim.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            incidentDate: {
              gte: fromDate,
              lte: toDate,
            },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a claim by id', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(mockClaim);

      const result = await service.findOne('claim-1', 'tenant-1');

      expect(result).toEqual(mockClaim);
    });

    it('should throw NotFoundException if claim not found', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(null);

      await expect(service.findOne('non-existent', 'tenant-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('review', () => {
    const reviewDto = {
      status: ClaimStatus.APPROVED,
      approvedAmount: 45000,
      adjusterNotes: [{ note: 'Approved with minor adjustments' }],
    };

    it('should review and approve a claim', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(mockClaim);
      mockPrismaService.claim.update.mockResolvedValue({
        ...mockClaim,
        ...reviewDto,
      });

      const result = await service.review('claim-1', 'tenant-1', 'user-1', reviewDto);

      expect(result.status).toBe(ClaimStatus.APPROVED);
      expect(result.approvedAmount).toBe(45000);
      expect(mockPrismaService.claim.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reviewedById: 'user-1',
            reviewedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('should throw BadRequestException if approving without approved amount', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(mockClaim);

      await expect(
        service.review('claim-1', 'tenant-1', 'user-1', {
          status: ClaimStatus.APPROVED,
          adjusterNotes: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if denying without reason', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(mockClaim);

      await expect(
        service.review('claim-1', 'tenant-1', 'user-1', {
          status: ClaimStatus.DENIED,
          adjusterNotes: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('processPayment', () => {
    it('should process payment for approved claim', async () => {
      const approvedClaim = {
        ...mockClaim,
        status: ClaimStatus.APPROVED,
        approvedAmount: 45000,
      };
      mockPrismaService.claim.findFirst.mockResolvedValue(approvedClaim);
      mockPrismaService.claim.update.mockResolvedValue({
        ...approvedClaim,
        paidAmount: 45000,
        status: ClaimStatus.PAID,
      });

      const result = await service.processPayment('claim-1', 'tenant-1', 45000);

      expect(result.status).toBe(ClaimStatus.PAID);
      expect(result.paidAmount).toBe(45000);
    });

    it('should throw BadRequestException if claim is not approved', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(mockClaim);

      await expect(
        service.processPayment('claim-1', 'tenant-1', 45000),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if paid amount exceeds approved amount', async () => {
      const approvedClaim = {
        ...mockClaim,
        status: ClaimStatus.APPROVED,
        approvedAmount: 45000,
      };
      mockPrismaService.claim.findFirst.mockResolvedValue(approvedClaim);

      await expect(
        service.processPayment('claim-1', 'tenant-1', 50000),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('close', () => {
    it('should close a paid claim', async () => {
      const paidClaim = {
        ...mockClaim,
        status: ClaimStatus.PAID,
        paidAmount: 45000,
      };
      mockPrismaService.claim.findFirst.mockResolvedValue(paidClaim);
      mockPrismaService.claim.update.mockResolvedValue({
        ...paidClaim,
        status: ClaimStatus.CLOSED,
        closedAt: new Date(),
      });

      const result = await service.close('claim-1', 'tenant-1');

      expect(result.status).toBe(ClaimStatus.CLOSED);
      expect(result.closedAt).toBeDefined();
    });

    it('should throw BadRequestException if claim is not in closable state', async () => {
      mockPrismaService.claim.findFirst.mockResolvedValue(mockClaim);

      await expect(service.close('claim-1', 'tenant-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStatistics', () => {
    it('should return claim statistics', async () => {
      mockPrismaService.claim.count.mockResolvedValue(10);
      mockPrismaService.claim.groupBy.mockResolvedValueOnce([
        { status: ClaimStatus.SUBMITTED, _count: 3 },
        { status: ClaimStatus.APPROVED, _count: 5 },
        { status: ClaimStatus.PAID, _count: 2 },
      ]);
      mockPrismaService.claim.groupBy.mockResolvedValueOnce([
        { claimType: ClaimType.PROPERTY_DAMAGE, _count: 6 },
        { claimType: ClaimType.LIABILITY, _count: 4 },
      ]);
      mockPrismaService.claim.aggregate
        .mockResolvedValueOnce({ _sum: { claimedAmount: 500000 } })
        .mockResolvedValueOnce({ _sum: { approvedAmount: 450000 } })
        .mockResolvedValueOnce({ _sum: { paidAmount: 200000 } });

      const result = await service.getStatistics('tenant-1');

      expect(result.totalClaims).toBe(10);
      expect(result.byStatus[ClaimStatus.SUBMITTED]).toBe(3);
      expect(result.totalClaimedAmount).toBe(500000);
      expect(result.totalApprovedAmount).toBe(450000);
      expect(result.totalPaidAmount).toBe(200000);
    });
  });
});
