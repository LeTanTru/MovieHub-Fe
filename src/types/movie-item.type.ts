import { VideoResType } from '@/types/video.type';

export type MovieItemResType = {
  id: number;
  status: number;
  title: string;
  kind: number;
  ordering: number;
  video: VideoResType;
  releaseDate: string;
};
