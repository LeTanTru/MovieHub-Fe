import { storageKeys } from '@/constants';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(storageKeys.ACCESS_TOKEN);
  cookieStore.delete(storageKeys.USER_KIND);
  return Response.json(
    { result: true, message: 'Logout successful' },
    { status: 200 }
  );
}
