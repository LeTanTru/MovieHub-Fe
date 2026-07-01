import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SelectField } from '@/components/form';
import { Form } from '@/components/ui/form';
import { sortOptions } from '@/constants';
import { CommentSortType } from '@/types';

type CommentSortProps = {
  selectedSort: CommentSortType;
  onSortChange: (value: CommentSortType) => void;
};

type FormValues = {
  sortType: CommentSortType;
};

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
        className='rounded-md text-white'
        formItemClassName='max-640:flex-1 max-768:w-1/3 h-8 w-50'
        renderOption={(option) => (
          <span title={option.label}>{option.label}</span>
        )}
      />
    </Form>
  );
}
