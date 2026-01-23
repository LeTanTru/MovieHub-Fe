import { loginSchema, registerSchema } from '@/schemaValidations';
import z from 'zod';

export type LoginType = z.output<typeof loginSchema>;
export type RegisterType = z.output<typeof registerSchema>;

export type LoginBodyType = LoginType;
export type RegisterBodyType = Omit<RegisterType, 'terms'>;

export type LoginResponseType = {
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

export type RefreshTokenResType = {
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

export type AuthType = 'login' | 'register';
