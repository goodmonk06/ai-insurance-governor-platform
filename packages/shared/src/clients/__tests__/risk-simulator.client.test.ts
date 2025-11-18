import { describe, it, expect, beforeEach } from 'vitest';
import { RiskSimulatorClient, RiskRank, ScenarioType } from '../..';

describe('RiskSimulatorClient', () => {
  let client: RiskSimulatorClient;

  beforeEach(() => {
    client = new RiskSimulatorClient(undefined, true); // Use mock mode
  });

  describe('mockSimulation', () => {
    it('should return low risk for well-equipped facility with long operation history', async () => {
      const result = await client.simulateRisk({
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: {
          facilityType: 'nursing_home',
          employeeCount: 25,
          bedCount: 50,
          yearsInOperation: 15,
          hasFireSafety: true,
          hasEmergencyPlan: true,
          annualRevenue: 250000000,
        },
      });

      expect(result.rank).toBe(RiskRank.LOW);
      expect(result.score).toBeLessThan(40);
      expect(result.details.recommendations).toBeDefined();
      expect(Array.isArray(result.details.recommendations)).toBe(true);
    });

    it('should return high risk for new facility without safety measures', async () => {
      const result = await client.simulateRisk({
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: {
          facilityType: 'nursing_home',
          employeeCount: 10,
          bedCount: 30,
          yearsInOperation: 1,
          hasFireSafety: false,
          hasEmergencyPlan: false,
          annualRevenue: 80000000,
        },
      });

      expect(result.rank).toMatch(/medium|high|critical/);
      expect(result.score).toBeGreaterThan(40);
      expect(result.details.recommendations).toContain('消防設備の設置・更新を検討してください');
      expect(result.details.recommendations).toContain('緊急時対応マニュアルの整備が必要です');
    });

    it('should calculate expected loss based on revenue', async () => {
      const annualRevenue = 100000000;
      const result = await client.simulateRisk({
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: {
          facilityType: 'nursing_home',
          annualRevenue,
          hasFireSafety: false,
          hasEmergencyPlan: false,
        },
      });

      expect(result.details.expectedLoss).toBeGreaterThan(0);
      expect(result.details.expectedLoss).toBeLessThanOrEqual(annualRevenue);
    });

    it('should provide different recommendations based on scenario type', async () => {
      const fireResult = await client.simulateRisk({
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: { facilityType: 'nursing_home' },
      });

      const infectionResult = await client.simulateRisk({
        scenarioType: ScenarioType.INFECTION_OUTBREAK,
        parameters: { facilityType: 'nursing_home' },
      });

      const malpracticeResult = await client.simulateRisk({
        scenarioType: ScenarioType.MEDICAL_MALPRACTICE,
        parameters: { facilityType: 'hospital' },
      });

      expect(fireResult.details.recommendations).toContain('定期的な避難訓練の実施を推奨します');
      expect(infectionResult.details.recommendations).toContain(
        '感染症対策マニュアルの整備と定期的な見直しが必要です',
      );
      expect(malpracticeResult.details.recommendations).toContain(
        '医療従事者向けの定期的な研修実施を推奨します',
      );
    });

    it('should return factors that influenced the risk score', async () => {
      const result = await client.simulateRisk({
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: {
          employeeCount: 30,
          bedCount: 100,
          yearsInOperation: 10,
          hasFireSafety: true,
          hasEmergencyPlan: true,
        },
      });

      expect(result.details.factors).toBeDefined();
      expect(result.details.factors.length).toBeGreaterThan(0);
      expect(result.details.factors[0]).toHaveProperty('name');
      expect(result.details.factors[0]).toHaveProperty('impact');
      expect(result.details.factors[0]).toHaveProperty('description');
    });

    it('should normalize score between 0 and 100', async () => {
      const extremeHighRiskResult = await client.simulateRisk({
        scenarioType: ScenarioType.INFECTION_OUTBREAK,
        parameters: {
          facilityType: 'nursing_home',
          bedCount: 500,
          employeeCount: 300,
          yearsInOperation: 0,
          hasFireSafety: false,
          hasEmergencyPlan: false,
        },
      });

      const extremeLowRiskResult = await client.simulateRisk({
        scenarioType: ScenarioType.NURSING_HOME_FIRE,
        parameters: {
          facilityType: 'nursing_home',
          bedCount: 20,
          employeeCount: 10,
          yearsInOperation: 30,
          hasFireSafety: true,
          hasEmergencyPlan: true,
        },
      });

      expect(extremeHighRiskResult.score).toBeGreaterThanOrEqual(0);
      expect(extremeHighRiskResult.score).toBeLessThanOrEqual(100);
      expect(extremeLowRiskResult.score).toBeGreaterThanOrEqual(0);
      expect(extremeLowRiskResult.score).toBeLessThanOrEqual(100);
    });

    it('should assign correct risk rank based on score', async () => {
      const testCases = [
        { score: 15, expectedRank: RiskRank.LOW },
        { score: 45, expectedRank: RiskRank.MEDIUM },
        { score: 70, expectedRank: RiskRank.HIGH },
        { score: 85, expectedRank: RiskRank.CRITICAL },
      ];

      for (const testCase of testCases) {
        // Create parameters that would result in approximately the target score
        const result = await client.simulateRisk({
          scenarioType: ScenarioType.NURSING_HOME_FIRE,
          parameters: {
            facilityType: 'nursing_home',
            bedCount: testCase.score > 60 ? 200 : 30,
            employeeCount: testCase.score > 60 ? 100 : 15,
            yearsInOperation: testCase.score < 40 ? 20 : 2,
            hasFireSafety: testCase.score < 60,
            hasEmergencyPlan: testCase.score < 60,
          },
        });

        // Verify the rank is consistent with the score
        if (result.score < 30) {
          expect(result.rank).toBe(RiskRank.LOW);
        } else if (result.score < 60) {
          expect(result.rank).toBe(RiskRank.MEDIUM);
        } else if (result.score < 80) {
          expect(result.rank).toBe(RiskRank.HIGH);
        } else {
          expect(result.rank).toBe(RiskRank.CRITICAL);
        }
      }
    });
  });
});
