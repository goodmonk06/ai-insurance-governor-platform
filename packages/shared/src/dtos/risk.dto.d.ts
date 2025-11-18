import { z } from 'zod';
import { ScenarioType } from '../types/enums';
export declare const assessRiskDtoSchema: z.ZodObject<{
    insuredEntityId: z.ZodString;
    scenarioType: z.ZodNativeEnum<typeof ScenarioType>;
    parameters: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
}, "strip", z.ZodTypeAny, {
    insuredEntityId: string;
    scenarioType: ScenarioType;
    parameters: Record<string, any>;
}, {
    insuredEntityId: string;
    scenarioType: ScenarioType;
    parameters?: Record<string, any> | undefined;
}>;
export type AssessRiskDto = z.infer<typeof assessRiskDtoSchema>;
//# sourceMappingURL=risk.dto.d.ts.map