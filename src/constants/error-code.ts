import { RegisterType } from '@/types';
import { ErrorMaps } from '@/types/form-error.type';

const ERROR_ACCOUNT_ERROR_0002 = 'ERROR-ACCOUNT-ERROR-0002';

export const registerErrorMaps: ErrorMaps<RegisterType> = {
  [ERROR_ACCOUNT_ERROR_0002]: [
    ['email', { type: 'manual', message: 'Email đã tồn tại' }]
  ]
};
