export type CategoryResType = {
  id: number;
  status: number;
  name: string;
  slug: string;
};

type CategoryState = {
  categories: CategoryResType[];
};

type CategoryActions = {
  setCategories: (categories: CategoryResType[]) => void;
};

export type CategoryStoreType = CategoryState & CategoryActions;
