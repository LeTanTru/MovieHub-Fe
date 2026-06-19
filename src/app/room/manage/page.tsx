import { redirect } from 'next/navigation';
import { route } from '@/routes';

// The /room/manage page is not yet implemented.
// Redirect to the room listing page to prevent a 404.
export default function RoomManagePage() {
  redirect(route.room.path as string);
}
