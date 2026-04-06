'use server';

import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

export const setCookieData = async (
  key: string,
  value: any,
  cookie?: Partial<ResponseCookie>
) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, cookie);
};

export const getCookieData = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value || null;
};

export const removeCookieData = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};
