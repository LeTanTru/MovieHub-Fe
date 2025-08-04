import { profileSchema, updateProfileSchema } from '@/schemaValidations';
import z from 'zod';

type ProfileType = z.infer<typeof profileSchema>;
type UpdateProfileType = z.infer<typeof updateProfileSchema>;

export type { ProfileType, UpdateProfileType };
