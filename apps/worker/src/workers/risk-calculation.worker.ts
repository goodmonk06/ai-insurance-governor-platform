import Queue from 'bull';
import { PrismaClient } from '@prisma/client';
import { RiskSimulatorClient, ScenarioType } from '@insurance-platform/shared';

const prisma = new PrismaClient();

const riskSimulator = new RiskSimulatorClient(
  process.env.RISK_SIMULATOR_URL,
  process.env.RISK_SIMULATOR_USE_MOCK === 'true',
);

export async function riskCalculationWorker() {
  const queue = new Queue('risk-calculation', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });

  queue.process('recalculate', async (job) => {
    const { insuredEntityId } = job.data;

    console.log(`Processing risk recalculation for insured entity: ${insuredEntityId}`);

    try {
      // 被保険者情報を取得
      const insuredEntity = await prisma.insuredEntity.findUnique({
        where: { id: insuredEntityId },
      });

      if (!insuredEntity) {
        throw new Error(`Insured entity not found: ${insuredEntityId}`);
      }

      // 複数のシナリオでリスク評価を実行
      const scenarios = [
        ScenarioType.NURSING_HOME_FIRE,
        ScenarioType.MEDICAL_MALPRACTICE,
        ScenarioType.EMPLOYEE_INJURY,
        ScenarioType.INFECTION_OUTBREAK,
      ];

      const assessments = [];

      for (const scenarioType of scenarios) {
        // リスクシミュレーション実行
        const result = await riskSimulator.simulateRisk({
          scenarioType,
          parameters: insuredEntity.metadata as any,
        });

        // 評価結果を保存
        const assessment = await prisma.riskAssessment.create({
          data: {
            insuredEntityId,
            scenarioType,
            score: result.score,
            rank: result.rank,
            detailJson: result.details as any,
            assessedAt: new Date(),
          },
        });

        assessments.push(assessment);
      }

      console.log(
        `✅ Completed risk recalculation for ${insuredEntityId}: ${assessments.length} assessments created`,
      );

      return { insuredEntityId, assessments: assessments.length };
    } catch (error) {
      console.error(`Failed to recalculate risk for ${insuredEntityId}:`, error);
      throw error;
    }
  });

  queue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
  });

  queue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
  });

  return queue;
}
