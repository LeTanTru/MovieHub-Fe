import { logger } from '@/logger';
import { NextResponse } from 'next/server';

export async function GET() {
  logger.info('GET request to /api/auth/login/google');
  return NextResponse.json({ success: true, provider: 'google' });
}
