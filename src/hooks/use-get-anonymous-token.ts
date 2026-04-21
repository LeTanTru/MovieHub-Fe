import { useEffect, useReducer, useRef } from 'react';
import { getAnonymousToken } from '@/app/actions/anonymous';

type AnonymousTokenState = {
  token: string;
  isLoadingToken: boolean;
};

type AnonymousTokenAction = {
  type: 'resolved';
  payload: string;
};

const initialState: AnonymousTokenState = {
  token: '',
  isLoadingToken: true
};

function anonymousTokenReducer(
  _state: AnonymousTokenState,
  action: AnonymousTokenAction
): AnonymousTokenState {
  switch (action.type) {
    case 'resolved':
      return {
        token: action.payload,
        isLoadingToken: false
      };
    default:
      return _state;
  }
}

const useGetAnonymousToken = () => {
  const [{ token, isLoadingToken }, dispatch] = useReducer(
    anonymousTokenReducer,
    initialState
  );
  const hasFetchedTokenRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasFetchedTokenRef.current) return;
    hasFetchedTokenRef.current = true;

    const handleGetToken = async () => {
      const anonymousToken = await getAnonymousToken();
      dispatch({
        type: 'resolved',
        payload: anonymousToken?.access_token || ''
      });
    };

    handleGetToken();

    const interval = setInterval(handleGetToken, 14 * 60 * 1000); // Refresh token every 14 minutes

    return () => clearInterval(interval);
  }, []);

  return { token, isLoadingToken };
};

export default useGetAnonymousToken;
