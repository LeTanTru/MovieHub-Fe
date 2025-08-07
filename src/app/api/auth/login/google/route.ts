import { authApiRequest } from '@/api-requests';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const req = await request.json();
  const cookieStore = await cookies();
  const code = req.code;
  try {
    const response = await authApiRequest.loginGoogleCallback(code);
    const accessToken = response.access_token!;
    const userKind = response.user_kind!;
    cookieStore.set(storageKeys.ACCESS_TOKEN, accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true
    });

    cookieStore.set(storageKeys.USER_KIND, String(userKind), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true
    });

    return Response.json(
      { data: response },
      {
        status: 200
      }
    );
  } catch (error) {
    logger.error('Error during Google login:', error);
    return Response.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
