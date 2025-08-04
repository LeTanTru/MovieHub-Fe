import { RegisterType } from '@/types';
import { ErrorMaps } from '@/types/form-error.type';

const ERROR_ACCOUNT_ERROR_0004 = 'ERROR-ACCOUNT-ERROR-0004';

export const registerErrorMaps: ErrorMaps<RegisterType> = {
  [ERROR_ACCOUNT_ERROR_0004]: [
    ['email', { type: 'manual', message: 'Email đã tồn tại' }]
  ]
};
