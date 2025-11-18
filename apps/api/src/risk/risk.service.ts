import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { RiskSimulatorClient, AssessRiskDto } from '@insurance-platform/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RiskService {
  private riskSimulator: RiskSimulatorClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @InjectQueue('risk-calculation') private riskQueue: Queue,
  ) {
    const useMock = this.configService.get('RISK_SIMULATOR_USE_MOCK') === 'true';
    const baseURL = this.configService.get('RISK_SIMULATOR_URL');
    this.riskSimulator = new RiskSimulatorClient(baseURL, useMock);
  }

  async assessRisk(data: AssessRiskDto) {
    // 被保険者の情報を取得
    const insuredEntity = await this.prisma.insuredEntity.findUnique({
      where: { id: data.insuredEntityId },
    });

    if (!insuredEntity) {
      throw new Error('Insured entity not found');
    }

    // リスクシミュレーターにリクエスト
    const simulationResult = await this.riskSimulator.simulateRisk({
      scenarioType: data.scenarioType,
      parameters: {
        ...data.parameters,
        ...insuredEntity.metadata,
      },
    });

    // 評価結果をDBに保存
    const assessment = await this.prisma.riskAssessment.create({
      data: {
        insuredEntityId: data.insuredEntityId,
        scenarioType: data.scenarioType,
        score: simulationResult.score,
        rank: simulationResult.rank,
        detailJson: simulationResult.details,
        assessedAt: new Date(),
      },
    });

    return {
      assessment,
      simulation: simulationResult,
    };
  }

  async getAssessments(insuredEntityId: string) {
    return this.prisma.riskAssessment.findMany({
      where: { insuredEntityId },
      orderBy: { assessedAt: 'desc' },
    });
  }

  async getLatestAssessment(insuredEntityId: string, scenarioType?: string) {
    return this.prisma.riskAssessment.findFirst({
      where: {
        insuredEntityId,
        ...(scenarioType && { scenarioType }),
      },
      orderBy: { assessedAt: 'desc' },
    });
  }

  async bulkRecalculate(tenantId: string) {
    // テナントの全被保険者を取得
    const insuredEntities = await this.prisma.insuredEntity.findMany({
      where: { tenantId },
    });

    // 各被保険者のリスク再計算ジョブをキューに追加
    const jobs = insuredEntities.map((entity) =>
      this.riskQueue.add('recalculate', {
        insuredEntityId: entity.id,
      }),
    );

    await Promise.all(jobs);

    return {
      message: `Queued ${insuredEntities.length} risk recalculation jobs`,
      count: insuredEntities.length,
    };
  }

  async getPortfolioRiskSummary(tenantId: string) {
    const assessments = await this.prisma.riskAssessment.findMany({
      where: {
        insuredEntity: {
          tenantId,
        },
      },
      include: {
        insuredEntity: true,
      },
      orderBy: { assessedAt: 'desc' },
    });

    // 被保険者ごとの最新評価のみを抽出
    const latestByEntity = new Map();
    for (const assessment of assessments) {
      if (!latestByEntity.has(assessment.insuredEntityId)) {
        latestByEntity.set(assessment.insuredEntityId, assessment);
      }
    }

    const latest = Array.from(latestByEntity.values());

    // ランクごとの集計
    const summary = {
      total: latest.length,
      byRank: {
        low: latest.filter((a) => a.rank === 'low').length,
        medium: latest.filter((a) => a.rank === 'medium').length,
        high: latest.filter((a) => a.rank === 'high').length,
        critical: latest.filter((a) => a.rank === 'critical').length,
      },
      averageScore: latest.reduce((sum, a) => sum + a.score, 0) / latest.length || 0,
      assessments: latest,
    };

    return summary;
  }
}
