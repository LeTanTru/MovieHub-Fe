'use client';

import { useEffect, useReducer, useRef } from 'react';
import { useResendOtpMutation } from '@/queries';
import { getData, setData, removeData, notify } from '@/utils';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';

const MAX_RESEND = 3; // RESEND LIMIT EACH 10 MINUTES
const RESEND_INTERVAL = 10 * 60 * 1000; // TIME TO RESEND AFTER REACH LIMIT
const COOLDOWN_TIME = 60 * 1000; // COOL DOWN BETWEEN EACH RESENDS

type ResendState = {
  resendData: {
    count: number;
    timestamp: number;
  };
  countdown: number;
  cooldownRemaining: number;
  lastResendTime: number;
};

type ResendAction =
  | {
      type: 'init';
      payload: {
        resendData: ResendState['resendData'];
        lastResendTime: number;
      };
    }
  | {
      type: 'tick';
      payload: {
        countdown: number;
        cooldownRemaining: number;
        resetResendData: boolean;
      };
    }
  | {
      type: 'set-last-resend-time';
      payload: number;
    }
  | {
      type: 'resend-success';
      payload: {
        count: number;
        timestamp: number;
      };
    };

const initialResendState: ResendState = {
  resendData: { count: 0, timestamp: 0 },
  countdown: 0,
  cooldownRemaining: 0,
  lastResendTime: 0
};

function resendReducer(state: ResendState, action: ResendAction): ResendState {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        resendData: action.payload.resendData,
        lastResendTime: action.payload.lastResendTime
      };
    case 'tick':
      return {
        ...state,
        countdown: action.payload.countdown,
        cooldownRemaining: action.payload.cooldownRemaining,
        resendData: action.payload.resetResendData
          ? { count: 0, timestamp: 0 }
          : state.resendData
      };
    case 'set-last-resend-time':
      return {
        ...state,
        lastResendTime: action.payload
      };
    case 'resend-success':
      return {
        ...state,
        resendData: {
          count: action.payload.count,
          timestamp: action.payload.timestamp
        },
        lastResendTime: action.payload.timestamp
      };
    default:
      return state;
  }
}

export const useResendOtpTimer = () => {
  const [state, dispatch] = useReducer(resendReducer, initialResendState);
  const lastResendTimeRef = useRef(state.lastResendTime);
  const { mutateAsync: resendOtpMutate, isPending: resendOtpLoading } =
    useResendOtpMutation();

  const getResendData = () => {
    const data = getData(storageKeys.RESEND_OTP_TIME);
    if (!data) return { count: 0, timestamp: 0 };
    return JSON.parse(data);
  };

  const setResendDataToLS = (count: number, timestamp: number) => {
    setData(storageKeys.RESEND_OTP_TIME, JSON.stringify({ count, timestamp }));
  };

  // Sync ref
  useEffect(() => {
    lastResendTimeRef.current = state.lastResendTime;
  }, [state.lastResendTime]);

  // Initial load
  useEffect(() => {
    const email = getData(storageKeys.EMAIL);
    if (!email) return;

    const lastTime = getData(storageKeys.LAST_RESEND_TIME);
    const resolvedLastResendTime = lastTime ? parseInt(lastTime) : 0;

    dispatch({
      type: 'init',
      payload: {
        resendData: getResendData(),
        lastResendTime: resolvedLastResendTime
      }
    });
  }, []);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const { timestamp } = getResendData();
      const remaining = RESEND_INTERVAL - (now - timestamp);
      const shouldResetResendData =
        remaining <= 0 && state.resendData.count > 0;

      if (shouldResetResendData) {
        setResendDataToLS(0, 0);
      }

      const cooldown =
        lastResendTimeRef.current > 0
          ? COOLDOWN_TIME - (now - lastResendTimeRef.current)
          : 0;

      dispatch({
        type: 'tick',
        payload: {
          countdown: remaining > 0 ? remaining : 0,
          cooldownRemaining: cooldown > 0 ? cooldown : 0,
          resetResendData: shouldResetResendData
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.resendData.count]);

  const handleResendOtp = async () => {
    const email = getData(storageKeys.EMAIL);
    if (!email) return;

    const now = Date.now();
    let { count, timestamp } = getResendData();

    if (state.cooldownRemaining > 0) {
      notify.error(
        `Vui lòng đợi ${Math.ceil(state.cooldownRemaining / 1000)} giây trước khi gửi lại`
      );
      return;
    }

    if (now - timestamp > RESEND_INTERVAL) {
      count = 0;
      timestamp = now;
    }

    if (count >= MAX_RESEND) {
      notify.error('Bạn đã gửi OTP quá 3 lần, vui lòng thử lại sau 10 phút');
      return;
    }

    await resendOtpMutate(
      { email },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Gửi lại OTP thành công');
            count += 1;
            timestamp = now;
            setResendDataToLS(count, timestamp);
            dispatch({
              type: 'resend-success',
              payload: { count, timestamp }
            });
            setData(storageKeys.LAST_RESEND_TIME, now.toString());
          } else {
            notify.error('Gửi lại OTP thất bại');
          }
        },
        onError: (error) => {
          logger.error('[RESEND_OTP_ERROR]', error);
          notify.error('Gửi lại OTP thất bại');
        }
      }
    );
  };

  const startCooldown = () => {
    const now = Date.now();
    dispatch({ type: 'set-last-resend-time', payload: now });
    setData(storageKeys.LAST_RESEND_TIME, now.toString());
  };

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const clearTimerData = () => {
    removeData([
      storageKeys.EMAIL,
      storageKeys.RESEND_OTP_TIME,
      storageKeys.LAST_RESEND_TIME
    ]);
  };

  const isResendDisabled =
    (state.resendData.count >= MAX_RESEND && state.countdown > 0) ||
    state.cooldownRemaining > 0;

  return {
    resendCount: state.resendData.count,
    countdown: state.countdown,
    cooldownRemaining: state.cooldownRemaining,
    isResendDisabled,
    resendOtpLoading,
    handleResendOtp,
    startCooldown,
    formatCountdown,
    clearTimerData
  };
};
