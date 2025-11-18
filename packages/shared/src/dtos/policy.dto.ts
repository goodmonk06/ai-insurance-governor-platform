import { z } from 'zod';
import { PolicyStatus } from '../types/enums';

export const createPolicyDtoSchema = z.object({
  insuredEntityId: z.string().uuid(),
  policyNumber: z.string().min(1),
  productName: z.string().min(1),
  premium: z.number().positive(),
  coverageJson: z.record(z.any()).default({}),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const updatePolicyDtoSchema = z.object({
  status: z.nativeEnum(PolicyStatus).optional(),
  premium: z.number().positive().optional(),
  coverageJson: z.record(z.any()).optional(),
  endDate: z.string().datetime().optional(),
});

export type CreatePolicyDto = z.infer<typeof createPolicyDtoSchema>;
export type UpdatePolicyDto = z.infer<typeof updatePolicyDtoSchema>;
