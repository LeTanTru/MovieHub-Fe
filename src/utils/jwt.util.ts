import { logger } from '@/utils/logger.util';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    logger.error('Failed to decode JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};
