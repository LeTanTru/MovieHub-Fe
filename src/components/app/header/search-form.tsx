'use client';

import { Col, InputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { searchSchema } from '@/schemaValidations';
import { SearchType } from '@/types';
import { Search } from 'lucide-react';

type SearchFormProps = {
  className?: string;
  inputClassName?: string;
};

export default function SearchForm({ className }: SearchFormProps) {
  const onSubmit = (values: SearchType) => {};
  const defaultValues: SearchType = {
    title: ''
  };

  return (
    <BaseForm
      schema={searchSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      className={className}
    >
      {(form) => (
        <>
          <Row className='h-search-form my-0'>
            <Col className='h-search-form' span={24}>
              <InputField
                formItemClassName='h-search-form'
                className='h-search-form border-none focus-visible:ring-slate-500'
                prefixIcon={<Search size={16} />}
                control={form.control}
                name='title'
                placeholder='Tìm kiếm phim, diễn viên'
              />
            </Col>
          </Row>
        </>
      )}
    </BaseForm>
  );
}
