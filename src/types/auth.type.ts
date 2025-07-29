import { loginSchema, registerSchema } from '@/schemaValidations';
import z from 'zod';

type LoginType = z.output<typeof loginSchema>;
type RegisterType = z.output<typeof registerSchema>;

export type { LoginType, RegisterType };
