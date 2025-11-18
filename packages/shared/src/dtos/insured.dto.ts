import { z } from 'zod';
import { InsuredEntityType } from '../types/enums';

export const createInsuredDtoSchema = z.object({
  type: z.nativeEnum(InsuredEntityType),
  name: z.string().min(1),
  taxId: z.string().optional(),
  address: z.string().min(1),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  metadata: z.record(z.any()).optional().default({}),
});

export const updateInsuredDtoSchema = createInsuredDtoSchema.partial();

export type CreateInsuredDto = z.infer<typeof createInsuredDtoSchema>;
export type UpdateInsuredDto = z.infer<typeof updateInsuredDtoSchema>;
