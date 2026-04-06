import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { removeCookieData } from '@/utils';
import { HttpStatusCode } from 'axios';

export async function POST() {
  try {
    await removeCookieData(storageKeys.ACCESS_TOKEN);
    await removeCookieData(storageKeys.REFRESH_TOKEN);

    return Response.json({ result: true }, { status: HttpStatusCode.Ok });
  } catch (error) {
    logger.error('Error while logging out', error);

    return Response.json(
      { result: false, message: 'Logout failed' },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
