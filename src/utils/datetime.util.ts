import { logger } from '@/logger';
import { format as formatFn, parse } from 'date-fns';

export const formatDate = (
  date: string | null,
  inputFormat = 'dd/MM/yyyy HH:mm:ss',
  outputFormat: string = 'dd/MM/yyyy'
) => {
  if (!date) return '';
  try {
    const parsedDate = parse(date, inputFormat, new Date());
    return formatFn(parsedDate, outputFormat);
  } catch (error) {
    logger.error('Invalid date', date, error);
    return date;
  }
};
