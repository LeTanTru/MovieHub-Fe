import { create } from 'zustand';

type BodyLoadType = {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
};

const useBodyLoadStore = create<BodyLoadType>((set) => ({
  isLoaded: true,
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded })
}));

export default useBodyLoadStore;
