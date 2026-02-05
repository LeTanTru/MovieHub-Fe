import {
  changePasswordSchema,
  forgotPasswordStep1Schema,
  forgotPasswordStep2Schema,
  loginSchema,
  otpSchema,
  registerSchema
} from '@/schemaValidations';
import { ProfileType } from '@/types/account.type';
import { z } from 'zod';

export type LoginType = z.output<typeof loginSchema>;
export type RegisterType = z.output<typeof registerSchema>;

export type LoginBodyType = LoginType;
export type RegisterBodyType = Omit<RegisterType, 'terms' | 'confirmPassword'>;
export type VerifyOtpBodyType = z.infer<typeof otpSchema>;
export type RequestForgotPasswordBodyType = z.infer<
  typeof forgotPasswordStep1Schema
>;

export type ForgotPasswordBodyType = RequestForgotPasswordBodyType &
  z.infer<typeof forgotPasswordStep2Schema>;

export type LoginResType = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  user_kind: number;
  tenant_info: string;
  user_id: string;
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
  user_id: string;
  grant_type: string;
  additional_info: string;
  jti: string;
};

type AuthState = {
  profile: ProfileType | null;
};

type AuthActions = {
  setProfile: (profile: ProfileType | null) => void;
};

export type AuthStoreType = AuthState & AuthActions;

export type CookieServerBodyType = LoginResType;

export type AnonymousResType = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

export type ChangePasswordBodyType = z.infer<typeof changePasswordSchema>;
