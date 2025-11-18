import { z } from 'zod';
import { UserRole } from '../types/enums';
export declare const loginDtoSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerDtoSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    tenantId: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    tenantId: string;
    role: UserRole;
}, {
    email: string;
    password: string;
    name: string;
    tenantId: string;
    role: UserRole;
}>;
export type LoginDto = z.infer<typeof loginDtoSchema>;
export type RegisterDto = z.infer<typeof registerDtoSchema>;
//# sourceMappingURL=auth.dto.d.ts.map