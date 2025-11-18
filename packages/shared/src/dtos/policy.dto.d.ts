import { z } from 'zod';
import { PolicyStatus } from '../types/enums';
export declare const createPolicyDtoSchema: z.ZodObject<{
    insuredEntityId: z.ZodString;
    policyNumber: z.ZodString;
    productName: z.ZodString;
    premium: z.ZodNumber;
    coverageJson: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    insuredEntityId: string;
    policyNumber: string;
    productName: string;
    premium: number;
    coverageJson: Record<string, any>;
    startDate: string;
    endDate: string;
}, {
    insuredEntityId: string;
    policyNumber: string;
    productName: string;
    premium: number;
    startDate: string;
    endDate: string;
    coverageJson?: Record<string, any> | undefined;
}>;
export declare const updatePolicyDtoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof PolicyStatus>>;
    premium: z.ZodOptional<z.ZodNumber>;
    coverageJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: PolicyStatus | undefined;
    premium?: number | undefined;
    coverageJson?: Record<string, any> | undefined;
    endDate?: string | undefined;
}, {
    status?: PolicyStatus | undefined;
    premium?: number | undefined;
    coverageJson?: Record<string, any> | undefined;
    endDate?: string | undefined;
}>;
export type CreatePolicyDto = z.infer<typeof createPolicyDtoSchema>;
export type UpdatePolicyDto = z.infer<typeof updatePolicyDtoSchema>;
//# sourceMappingURL=policy.dto.d.ts.map