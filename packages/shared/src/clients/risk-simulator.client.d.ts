import { ScenarioType, RiskRank } from '../types/enums';
export interface RiskSimulationRequest {
    scenarioType: ScenarioType;
    parameters: {
        facilityType?: string;
        employeeCount?: number;
        bedCount?: number;
        yearsInOperation?: number;
        hasFireSafety?: boolean;
        hasEmergencyPlan?: boolean;
        annualRevenue?: number;
        [key: string]: any;
    };
}
export interface RiskSimulationResponse {
    score: number;
    rank: RiskRank;
    details: {
        probability: number;
        severity: number;
        expectedLoss: number;
        recommendations: string[];
        factors: Array<{
            name: string;
            impact: number;
            description: string;
        }>;
    };
}
export declare class RiskSimulatorClient {
    private client;
    private useMock;
    constructor(baseURL?: string, useMock?: boolean);
    simulateRisk(request: RiskSimulationRequest): Promise<RiskSimulationResponse>;
    private mockSimulation;
    private getRecommendations;
    private getFactors;
}
//# sourceMappingURL=risk-simulator.client.d.ts.map