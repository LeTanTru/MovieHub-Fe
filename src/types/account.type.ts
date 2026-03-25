import { updateProfileSchema } from '@/schemaValidations';
import { z } from 'zod';

export type UpdateProfileBodyType = z.infer<typeof updateProfileSchema>;

export type ProfileResType = {
  id: string;
  kind: number;
  username: string;
  phone: string;
  email: string;
  fullName: string;
  avatarPath: string;
  group: {
    id: string;
    name: string;
    kind: number;
  };
  gender: number;
};
