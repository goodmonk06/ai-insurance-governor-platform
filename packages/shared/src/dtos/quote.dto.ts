import { z } from 'zod';
import { QuoteStatus } from '../types/enums';

export const createQuoteDtoSchema = z.object({
  insuredEntityId: z.string().uuid(),
  answersJson: z.record(z.any()),
});

export const updateQuoteStatusDtoSchema = z.object({
  status: z.nativeEnum(QuoteStatus),
  quotedPremium: z.number().positive().optional(),
  quotedCoverage: z.record(z.any()).optional(),
});

export type CreateQuoteDto = z.infer<typeof createQuoteDtoSchema>;
export type UpdateQuoteStatusDto = z.infer<typeof updateQuoteStatusDtoSchema>;
