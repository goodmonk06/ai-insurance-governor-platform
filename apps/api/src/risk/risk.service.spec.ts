import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bull';
import { RiskService } from './risk.service';
import { PrismaService } from '../prisma/prisma.service';
import { ScenarioType, RiskRank } from '@insurance-platform/shared';

describe('RiskService', () => {
  let service: RiskService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    insuredEntity: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    riskAssessment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'RISK_SIMULATOR_USE_MOCK') return 'true';
      if (key === 'RISK_SIMULATOR_URL') return 'http://localhost:3001/api';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getQueueToken('risk-calculation'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<RiskService>(RiskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assessRisk', () => {
    it('should successfully assess risk for a valid insured entity', async () => {
      const mockEntity = {
        id: 'test-id',
        name: 'Test Facility',
        metadata: {
          facilityType: 'nursing_home',
          bedCount: 50,
          employeeCount: 25,
          yearsInOperation: 10,
          hasFireSafety: true,
          hasEmergencyPlan: true,
        },
      };

      const mockAssessment = {
        id: 'assessment-id',
        insuredEntityId: 'test-id',
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        score: 35.5,
        rank: RiskRank.MEDIUM,
        detailJson: {},
        assessedAt: new Date(),
      };

      mockPrismaService.insuredEntity.findUnique.mockResolvedValue(mockEntity);
      mockPrismaService.riskAssessment.create.mockResolvedValue(mockAssessment);

      const result = await service.assessRisk({
        insuredEntityId: 'test-id',
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: {},
      });

      expect(result).toHaveProperty('assessment');
      expect(result).toHaveProperty('simulation');
      expect(result.assessment).toBeDefined();
      expect(result.simulation.score).toBeGreaterThanOrEqual(0);
      expect(result.simulation.score).toBeLessThanOrEqual(100);
      expect(mockPrismaService.insuredEntity.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockPrismaService.riskAssessment.create).toHaveBeenCalled();
    });

    it('should throw error when insured entity not found', async () => {
      mockPrismaService.insuredEntity.findUnique.mockResolvedValue(null);

      await expect(
        service.assessRisk({
          insuredEntityId: 'non-existent',
          scenarioType: ScenarioType.NURSING_HOME_FIRE,
          parameters: {},
        }),
      ).rejects.toThrow('Insured entity not found');
    });
  });

  describe('getAssessments', () => {
    it('should return all assessments for an insured entity', async () => {
      const mockAssessments = [
        {
          id: '1',
          insuredEntityId: 'test-id',
          scenarioType: ScenarioType.NURSING_HOME_FIRE,
          score: 35,
          rank: RiskRank.MEDIUM,
        },
        {
          id: '2',
          insuredEntityId: 'test-id',
          scenarioType: ScenarioType.INFECTION_OUTBREAK,
          score: 45,
          rank: RiskRank.MEDIUM,
        },
      ];

      mockPrismaService.riskAssessment.findMany.mockResolvedValue(mockAssessments);

      const result = await service.getAssessments('test-id');

      expect(result).toEqual(mockAssessments);
      expect(mockPrismaService.riskAssessment.findMany).toHaveBeenCalledWith({
        where: { insuredEntityId: 'test-id' },
        orderBy: { assessedAt: 'desc' },
      });
    });
  });

  describe('getLatestAssessment', () => {
    it('should return the latest assessment', async () => {
      const mockAssessment = {
        id: '1',
        insuredEntityId: 'test-id',
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        score: 35,
        rank: RiskRank.MEDIUM,
        assessedAt: new Date(),
      };

      mockPrismaService.riskAssessment.findFirst.mockResolvedValue(mockAssessment);

      const result = await service.getLatestAssessment('test-id');

      expect(result).toEqual(mockAssessment);
      expect(mockPrismaService.riskAssessment.findFirst).toHaveBeenCalledWith({
        where: { insuredEntityId: 'test-id' },
        orderBy: { assessedAt: 'desc' },
      });
    });

    it('should filter by scenario type when provided', async () => {
      await service.getLatestAssessment('test-id', ScenarioType.NURSING_HOME_FIRE);

      expect(mockPrismaService.riskAssessment.findFirst).toHaveBeenCalledWith({
        where: {
          insuredEntityId: 'test-id',
          scenarioType: ScenarioType.NURSING_HOME_FIRE,
        },
        orderBy: { assessedAt: 'desc' },
      });
    });
  });
});
