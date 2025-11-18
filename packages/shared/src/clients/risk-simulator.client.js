"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskSimulatorClient = void 0;
const axios_1 = __importDefault(require("axios"));
const enums_1 = require("../types/enums");
class RiskSimulatorClient {
    client;
    useMock;
    constructor(baseURL, useMock = true) {
        this.useMock = useMock;
        this.client = axios_1.default.create({
            baseURL: baseURL || 'http://localhost:3001/api',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async simulateRisk(request) {
        if (this.useMock) {
            return this.mockSimulation(request);
        }
        try {
            const response = await this.client.post('/risk/simulate', request);
            return response.data;
        }
        catch (error) {
            console.error('Risk simulation failed, falling back to mock', error);
            return this.mockSimulation(request);
        }
    }
    mockSimulation(request) {
        // モックロジック: パラメータに基づいて簡易的なスコア計算
        const params = request.parameters;
        let baseScore = 50;
        // 施設タイプによる調整
        if (params.facilityType === 'nursing_home')
            baseScore += 10;
        if (params.facilityType === 'hospital')
            baseScore += 15;
        // 従業員数・ベッド数による調整
        if (params.employeeCount && params.employeeCount > 50)
            baseScore += 10;
        if (params.bedCount && params.bedCount > 100)
            baseScore += 15;
        // 運営年数（経験年数が多いほどリスク減）
        if (params.yearsInOperation && params.yearsInOperation > 10)
            baseScore -= 10;
        // 安全対策の有無
        if (params.hasFireSafety)
            baseScore -= 15;
        if (params.hasEmergencyPlan)
            baseScore -= 10;
        // シナリオタイプによる調整
        switch (request.scenarioType) {
            case enums_1.ScenarioType.NURSING_HOME_FIRE:
                baseScore += params.hasFireSafety ? -20 : 20;
                break;
            case enums_1.ScenarioType.MEDICAL_MALPRACTICE:
                baseScore += params.employeeCount && params.employeeCount < 20 ? 15 : 0;
                break;
            case enums_1.ScenarioType.INFECTION_OUTBREAK:
                baseScore += params.bedCount && params.bedCount > 200 ? 25 : 0;
                break;
        }
        // スコアを0-100に正規化
        const score = Math.max(0, Math.min(100, baseScore));
        // ランク決定
        let rank;
        if (score < 30)
            rank = enums_1.RiskRank.LOW;
        else if (score < 60)
            rank = enums_1.RiskRank.MEDIUM;
        else if (score < 80)
            rank = enums_1.RiskRank.HIGH;
        else
            rank = enums_1.RiskRank.CRITICAL;
        // 期待損失額の計算（簡易版）
        const annualRevenue = params.annualRevenue || 100000000;
        const expectedLoss = (score / 100) * annualRevenue * 0.1;
        return {
            score,
            rank,
            details: {
                probability: score / 100,
                severity: score > 70 ? 0.8 : score > 40 ? 0.5 : 0.3,
                expectedLoss,
                recommendations: this.getRecommendations(request.scenarioType, score, params),
                factors: this.getFactors(request.scenarioType, params),
            },
        };
    }
    getRecommendations(scenarioType, score, params) {
        const recommendations = [];
        if (score > 70) {
            recommendations.push('緊急対応計画の見直しと更新が必要です');
            recommendations.push('リスク軽減のための即時対策を推奨します');
        }
        if (!params.hasFireSafety) {
            recommendations.push('消防設備の設置・更新を検討してください');
        }
        if (!params.hasEmergencyPlan) {
            recommendations.push('緊急時対応マニュアルの整備が必要です');
        }
        if (params.yearsInOperation && params.yearsInOperation < 3) {
            recommendations.push('運営実績が浅いため、経験豊富な管理者の配置を推奨します');
        }
        switch (scenarioType) {
            case enums_1.ScenarioType.NURSING_HOME_FIRE:
                recommendations.push('定期的な避難訓練の実施を推奨します');
                break;
            case enums_1.ScenarioType.INFECTION_OUTBREAK:
                recommendations.push('感染症対策マニュアルの整備と定期的な見直しが必要です');
                break;
            case enums_1.ScenarioType.MEDICAL_MALPRACTICE:
                recommendations.push('医療従事者向けの定期的な研修実施を推奨します');
                break;
        }
        return recommendations;
    }
    getFactors(scenarioType, params) {
        const factors = [];
        if (params.employeeCount) {
            factors.push({
                name: '従業員数',
                impact: params.employeeCount > 50 ? 0.3 : 0.1,
                description: `${params.employeeCount}名の従業員が在籍`,
            });
        }
        if (params.bedCount) {
            factors.push({
                name: '収容人数',
                impact: params.bedCount > 100 ? 0.4 : 0.2,
                description: `${params.bedCount}床の収容能力`,
            });
        }
        if (params.yearsInOperation) {
            factors.push({
                name: '運営年数',
                impact: params.yearsInOperation > 10 ? -0.2 : 0.1,
                description: `${params.yearsInOperation}年の運営実績`,
            });
        }
        factors.push({
            name: '安全対策',
            impact: params.hasFireSafety && params.hasEmergencyPlan ? -0.3 : 0.2,
            description: params.hasFireSafety && params.hasEmergencyPlan
                ? '適切な安全対策が実施されています'
                : '安全対策の強化が必要です',
        });
        return factors;
    }
}
exports.RiskSimulatorClient = RiskSimulatorClient;
//# sourceMappingURL=risk-simulator.client.js.map