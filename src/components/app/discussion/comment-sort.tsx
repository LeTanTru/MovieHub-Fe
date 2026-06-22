import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SelectField } from '@/components/form';
import { Form } from '@/components/ui/form';

export type CommentSortType = 'newest' | 'topLiked' | 'topDisliked';

type CommentSortProps = {
  selectedSort: CommentSortType;
  onSortChange: (value: CommentSortType) => void;
};

type FormValues = {
  sortType: CommentSortType;
};

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'topLiked', label: 'Nhiều lượt thích nhất' },
  { value: 'topDisliked', label: 'Nhiều lượt không thích nhất' }
];

export function CommentSort({ selectedSort, onSortChange }: CommentSortProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      sortType: selectedSort
    }
  });

  const { control, setValue } = form;

  useEffect(() => {
    setValue('sortType', selectedSort);
  }, [selectedSort, setValue]);

  return (
    <Form {...form}>
      <SelectField
        control={control}
        name='sortType'
        options={sortOptions}
        onValueChange={(val) => {
          if (val) {
            onSortChange(val as CommentSortType);
          }
        }}
        className='max-640:w-36 max-480:w-28 h-8 w-40 rounded-md px-2! text-xs text-white'
        formItemClassName='text-xs'
        renderOption={(option) => (
          <span title={option.label} className='text-xs'>
            {option.label}
          </span>
        )}
      />
    </Form>
  );
}
