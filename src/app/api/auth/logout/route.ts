import { authApiRequest } from '@/api-requests';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import {
  removeAccessTokenFromCookie,
  removeCookieData,
  removeRefreshTokenFromCookie
} from '@/utils';
import { HttpStatusCode } from 'axios';

export async function POST() {
  try {
    const res = await authApiRequest.logoutFromNextServer();
    if (res.result) {
      removeAccessTokenFromCookie();
      removeRefreshTokenFromCookie();
      removeCookieData(storageKeys.USER_KIND);
    }
    return Response.json(res, { status: HttpStatusCode.Ok });
  } catch (error) {
    logger.error('Error while logging out', error);

    return Response.json(
      { result: false, message: 'Logout failed' },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
