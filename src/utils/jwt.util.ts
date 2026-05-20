import { logger } from '@/logger';
import { jwtDecode } from 'jwt-decode';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

export const decodeJwt = (
  token: string
): { exp: number; authorities: string[] } | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    logger.error('[DECODE_JWT_ERROR]', error);
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / MS_PER_SECOND);
  return payload.exp < now;
};

export const isTokenExpiringSoon = (
  token: string | null,
  thresholdMinutes = 15
): boolean => {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / MS_PER_SECOND);
  const threshold = thresholdMinutes * SECONDS_PER_MINUTE;

  return payload.exp < now + threshold;
};
