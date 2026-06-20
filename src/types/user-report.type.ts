import { userReportSchema } from '@/schemaValidations';
import z from 'zod';

export type UserReportBodyType = z.infer<typeof userReportSchema>;
