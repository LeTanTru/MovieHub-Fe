export type AppLoadingState = {
  loading: boolean;
};

export type AppLoadingActions = {
  setLoading: (loading: boolean) => void;
};

export type AppLoadingStoreType = AppLoadingState & AppLoadingActions;
