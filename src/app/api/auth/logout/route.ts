import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { removeCookiesData } from '@/utils';
import { HttpStatusCode } from 'axios';

export async function POST() {
  try {
    await removeCookiesData([
      storageKeys.ACCESS_TOKEN,
      storageKeys.REFRESH_TOKEN,
      storageKeys.USER_KIND
    ]);
    return Response.json({ result: true }, { status: HttpStatusCode.Ok });
  } catch (error) {
    logger.error('Error while logging out', error);

    return Response.json(
      { result: false, message: 'Logout failed' },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
