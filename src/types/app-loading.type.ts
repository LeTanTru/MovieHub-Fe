type AppLoadingState = {
  loading: boolean;
};

type AppLoadingActions = {
  setLoading: (loading: boolean) => void;
};

export type AppLoadingStoreType = AppLoadingState & AppLoadingActions;
