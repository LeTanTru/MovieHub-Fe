const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (...args: any[]) => {
    if (isDev) console.log('[INFO]', ...args); // eslint-disable-line no-console
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn('[WARN]', ...args); // eslint-disable-line no-console
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args); // eslint-disable-line no-console
  }
};
