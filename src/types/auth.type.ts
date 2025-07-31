import { loginSchema, registerSchema } from '@/schemaValidations';
import z from 'zod';

type LoginType = z.output<typeof loginSchema>;
type RegisterType = z.output<typeof registerSchema>;

type LoginResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  user_kind: number;
  tenant_info: string;
  user_id: number;
  grant_type: string;
  additional_info: string;
  jti: string;
};

export type { LoginType, RegisterType, LoginResponse };
