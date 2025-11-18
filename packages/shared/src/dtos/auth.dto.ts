import { z } from 'zod';
import { UserRole } from '../types/enums';

export const loginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  tenantId: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;
export type RegisterDto = z.infer<typeof registerDtoSchema>;
