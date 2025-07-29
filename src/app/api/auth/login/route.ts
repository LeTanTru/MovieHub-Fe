import { NextResponse } from 'next/server';

export async function GET() {
  console.log('GET request to /api/auth/login/google');
  return NextResponse.json({ success: true, provider: 'google' });
}
