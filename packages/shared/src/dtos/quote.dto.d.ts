import { z } from 'zod';
import { QuoteStatus } from '../types/enums';
export declare const createQuoteDtoSchema: z.ZodObject<{
    insuredEntityId: z.ZodString;
    answersJson: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    insuredEntityId: string;
    answersJson: Record<string, any>;
}, {
    insuredEntityId: string;
    answersJson: Record<string, any>;
}>;
export declare const updateQuoteStatusDtoSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof QuoteStatus>;
    quotedPremium: z.ZodOptional<z.ZodNumber>;
    quotedCoverage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status: QuoteStatus;
    quotedPremium?: number | undefined;
    quotedCoverage?: Record<string, any> | undefined;
}, {
    status: QuoteStatus;
    quotedPremium?: number | undefined;
    quotedCoverage?: Record<string, any> | undefined;
}>;
export type CreateQuoteDto = z.infer<typeof createQuoteDtoSchema>;
export type UpdateQuoteStatusDto = z.infer<typeof updateQuoteStatusDtoSchema>;
//# sourceMappingURL=quote.dto.d.ts.map