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
      <div className='flex justify-end'>
        <SelectField
          control={control}
          name='episodeId'
          options={filterOptions}
          onValueChange={(val) => {
            if (val) {
              onValueChange(String(val));
            }
          }}
          className='max-640:w-36 max-480:w-28 mt-4 h-8 w-40 rounded-md px-2! text-xs text-white'
          formItemClassName='text-xs'
          renderOption={(option) => (
            <span title={option.label} className='text-xs'>
              {option.label}
            </span>
          )}
        />
      </div>
    </Form>
  );
}
