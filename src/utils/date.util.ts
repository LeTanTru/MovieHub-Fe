import { DATE_TIME_FORMAT } from '@/constants';
import { logger } from '@/logger';
import { format as formatFn, isValid, parse } from 'date-fns';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_YEAR = 52;
const TIME_AGO_JUST_NOW_THRESHOLD = 5;

export const formatDate = (
  date: string | null | undefined,
  outputFormat: string = DATE_TIME_FORMAT,
  inputFormat: string = DATE_TIME_FORMAT
) => {
  if (!date) return '';

  try {
    const parsedDate = parse(date, inputFormat, new Date());

    if (!isValid(parsedDate)) return '';

    return formatFn(parsedDate, outputFormat);
  } catch (error) {
    logger.error('[DATE_FORMAT_ERROR]', error);
    return '';
  }
};

export const convertLocalToUTC = (
  date: string | null,
  inputFormat: string = DATE_TIME_FORMAT,
  outputFormat: string = DATE_TIME_FORMAT
) => {
  if (!date) return '';

  try {
    const parsedDate = parse(date, inputFormat, new Date());
    if (!isValid(parsedDate)) return '';

    const utcDate = new Date(
      parsedDate.getTime() +
        parsedDate.getTimezoneOffset() * SECONDS_PER_MINUTE * MS_PER_SECOND
    );

    return formatFn(utcDate, outputFormat);
  } catch (error) {
    logger.error('[CONVERT_LOCAL_TO_UTC_ERROR]', error);
    return '';
  }
};

export const convertUTCToLocal = (
  date: string | null,
  inputFormat: string = DATE_TIME_FORMAT,
  outputFormat: string = DATE_TIME_FORMAT
) => {
  if (!date) return '';

  try {
    const parsedDate = parse(date, inputFormat, new Date());
    if (!isValid(parsedDate)) return '';

    const localDate = new Date(
      parsedDate.getTime() -
        parsedDate.getTimezoneOffset() * SECONDS_PER_MINUTE * MS_PER_SECOND
    );

    return formatFn(localDate, outputFormat);
  } catch (error) {
    logger.error('[CONVERT_UTC_TO_LOCAL_ERROR]', error);
    return '';
  }
};

export const timeAgo = (dateStr: string, short = false) => {
  if (!dateStr) return short ? '0s' : 'Vừa xong';

  try {
    let date: Date | null = null;

    if (dateStr.includes('/')) {
      const [day, month, yearAndTime] = dateStr.split('/');
      const [year, time] = yearAndTime.split(' ');
      const iso = `${year}-${month}-${day}T${time}+00:00`;
      date = new Date(iso);
    } else {
      date = new Date(dateStr);
    }

    if (!date || isNaN(date.getTime())) return 'Invalid date';

    const seconds = Math.floor((Date.now() - date.getTime()) / MS_PER_SECOND);

    if (seconds < TIME_AGO_JUST_NOW_THRESHOLD) return short ? '0s' : 'Vừa xong';
    if (seconds < SECONDS_PER_MINUTE)
      return short ? `${seconds}s` : `${seconds} giây trước`;

    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    if (minutes < MINUTES_PER_HOUR)
      return short ? `${minutes}m` : `${minutes} phút trước`;

    const hours = Math.floor(minutes / MINUTES_PER_HOUR);
    if (hours < HOURS_PER_DAY)
      return short ? `${hours}h` : `${hours} giờ trước`;

    const days = Math.floor(hours / HOURS_PER_DAY);
    if (days < DAYS_PER_WEEK) return short ? `${days}d` : `${days} ngày trước`;

    const weeks = Math.floor(days / DAYS_PER_WEEK);
    if (weeks < WEEKS_PER_YEAR)
      return short ? `${weeks}w` : `${weeks} tuần trước`;

    const years = Math.floor(weeks / WEEKS_PER_YEAR);
    return short ? `${years}y` : `${years} năm trước`;
  } catch {
    return 'Invalid date';
  }
};

export const getYearFromDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';

  try {
    let year: string | undefined;

    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      year = parts[parts.length - 1]?.split(' ')[0];
    } else {
      const date = new Date(dateStr);
      if (isValid(date)) {
        year = date.getFullYear().toString();
      }
    }

    return year || 'N/A';
  } catch {
    return 'N/A';
  }
};
