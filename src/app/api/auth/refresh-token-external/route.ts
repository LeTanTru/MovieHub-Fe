import { apiConfig } from '@/constants';
import { logger } from '@/logger';
import axios, { HttpStatusCode } from 'axios';

export async function POST(request: Request) {
  const { refresh_token, grant_type } = await request.json();

  try {
    const basicAuth = Buffer.from(
      `${process.env.APP_USERNAME}:${process.env.APP_PASSWORD}`
    ).toString('base64');

    const response = await axios.post(
      apiConfig.user.refreshToken.baseUrl,
      {
        refresh_token,
        grant_type
      },
      {
        headers: {
          Authorization: `Basic ${basicAuth}`
        }
      }
    );

    return Response.json(response.data, {
      status: HttpStatusCode.Ok
    });
  } catch (error) {
    logger.error('Error in refresh-token-external proxy:', error);

    if (axios.isAxiosError(error) && error.response) {
      return Response.json(
        {
          message: error.response.data?.message || 'Token refresh failed',
          data: error.response.data?.data
        },
        { status: error.response.status }
      );
    }

    return Response.json(
      { message: 'Internal server error' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
