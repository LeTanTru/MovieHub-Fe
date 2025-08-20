type MovieType = {
  id: number;
  title: string;
  originalTitle: string;
  slug: string;
  thumbnailUrl: string;
  type: number;
  releaseDate: string;
};

type PersonType = {
  id: number;
  name: string;
  otherName: string;
  avatarPath: string;
  country: string;
  kinds: number[];
};

export type MoviePersonResType = {
  id: number;
  status: number;
  modifiedDate: string;
  createdDate: string;
  movie: MovieType;
  person: PersonType;
  kind: number;
  characterName: string;
  ordering: number;
};
