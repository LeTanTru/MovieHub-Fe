const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.log('[INFO]', ...args); // eslint-disable-line no-console
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn('[WARN]', ...args); // eslint-disable-line no-console
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args); // eslint-disable-line no-console
  }
};
