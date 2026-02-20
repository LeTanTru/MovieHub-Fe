type AppLoadingState = {
  loading: boolean;
};

type AppLoadingAction = {
  setLoading: (loading: boolean) => void;
};

export type AppLoadingStoreType = AppLoadingState & AppLoadingAction;
