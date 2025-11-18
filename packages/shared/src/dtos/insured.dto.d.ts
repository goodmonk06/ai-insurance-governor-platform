import { z } from 'zod';
import { InsuredEntityType } from '../types/enums';
export declare const createInsuredDtoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof InsuredEntityType>;
    name: z.ZodString;
    taxId: z.ZodOptional<z.ZodString>;
    address: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
}, "strip", z.ZodTypeAny, {
    type: InsuredEntityType;
    name: string;
    address: string;
    metadata: Record<string, any>;
    email?: string | undefined;
    taxId?: string | undefined;
    phoneNumber?: string | undefined;
}, {
    type: InsuredEntityType;
    name: string;
    address: string;
    email?: string | undefined;
    taxId?: string | undefined;
    phoneNumber?: string | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export declare const updateInsuredDtoSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodNativeEnum<typeof InsuredEntityType>>;
    name: z.ZodOptional<z.ZodString>;
    taxId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    type?: InsuredEntityType | undefined;
    name?: string | undefined;
    taxId?: string | undefined;
    address?: string | undefined;
    phoneNumber?: string | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    email?: string | undefined;
    type?: InsuredEntityType | undefined;
    name?: string | undefined;
    taxId?: string | undefined;
    address?: string | undefined;
    phoneNumber?: string | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export type CreateInsuredDto = z.infer<typeof createInsuredDtoSchema>;
export type UpdateInsuredDto = z.infer<typeof updateInsuredDtoSchema>;
//# sourceMappingURL=insured.dto.d.ts.map