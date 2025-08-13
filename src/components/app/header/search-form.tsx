'use client';

import { Button, Col, InputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { cn } from '@/lib';
import { searchSchema } from '@/schemaValidations';
import { SearchType } from '@/types';
import { Search } from 'lucide-react';
import React from 'react';

type SearchFormProps = {
  className?: string;
  inputClassName?: string;
};

export default function SearchForm({
  className,
  inputClassName
}: SearchFormProps) {
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
            <Col className='h-search-form'>
              <InputField
                formItemClassName='h-search-form'
                className='h-search-form'
                prefixIcon={
                  <Button
                    variant='ghost'
                    className={cn('p-1! hover:bg-transparent!', inputClassName)}
                  >
                    <Search size={16} />
                  </Button>
                }
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
