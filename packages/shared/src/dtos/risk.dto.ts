import { z } from 'zod';
import { ScenarioType } from '../types/enums';

export const assessRiskDtoSchema = z.object({
  insuredEntityId: z.string().uuid(),
  scenarioType: z.nativeEnum(ScenarioType),
  parameters: z.record(z.any()).optional().default({}),
});

export type AssessRiskDto = z.infer<typeof assessRiskDtoSchema>;
