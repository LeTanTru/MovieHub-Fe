import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MOVIE_TYPE_SERIES } from '@/constants';
import { MovieResType } from '@/types';
import { SelectField } from '@/components/form';
import { Form } from '@/components/ui/form';

type CommentFilterProps = {
  movie: MovieResType;
  selectedEpisodeId: string;
  onValueChange: (value: string) => void;
};

type FormValues = {
  episodeId: string;
};

export function CommentFilter({
  movie,
  selectedEpisodeId,
  onValueChange
}: CommentFilterProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      episodeId: selectedEpisodeId
    }
  });

  const { control, setValue } = form;

  useEffect(() => {
    setValue('episodeId', selectedEpisodeId);
  }, [selectedEpisodeId, setValue]);

  const filterOptions = useMemo(() => {
    if (!movie || movie.type !== MOVIE_TYPE_SERIES || !movie.seasons) {
      return [];
    }

    const options = [{ value: 'all', label: 'Tất cả bình luận' }];

    movie.seasons.forEach((season) => {
      if (season.episodes) {
        season.episodes.forEach((episode) => {
          options.push({
            value: episode.id,
            label: `Phần ${season.label} - Tập ${episode.label}`
          });
        });
      }
    });

    return options;
  }, [movie]);

  if (movie.type !== MOVIE_TYPE_SERIES || filterOptions.length === 0) {
    return null;
  }

  return (
    <Form {...form}>
      <SelectField
        control={control}
        name='episodeId'
        options={filterOptions}
        onValueChange={(val) => {
          if (val) {
            onValueChange(String(val));
          }
        }}
        className='rounded-md px-2! text-white'
        formItemClassName='max-640:w-1/2 max-768:w-1/3 h-8 w-50'
        renderOption={(option) => (
          <span title={option.label}>{option.label}</span>
        )}
      />
    </Form>
  );
}
