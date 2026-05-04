import { notificationUpdateReadSchema } from '@/schemaValidations';
import z from 'zod';

export type NotificationCountReadResType = {
  totalUnread: number;
};

export type NotificationResType = {
  body: string;
  cmd: string;
  createdDate: string;
  id: string;
  isRead: boolean;
  modifiedDate: string;
  status: number;
  title: string;
  type: number;
};

export type NotificationUpdateReadBodyType = z.infer<
  typeof notificationUpdateReadSchema
>;
