'use client';

import { Button, Col, InputField, Row } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { searchSchema } from '@/schemaValidations';
import { SearchType } from '@/types';
import { Search } from 'lucide-react';
import React from 'react';

export default function SearchForm() {
  const onSubmit = (values: SearchType) => {
    console.log('🚀 ~ onSubmit ~ values:', values);
  };
  const defaultValues: SearchType = {
    title: ''
  };

  return (
    <BaseForm
      schema={searchSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    >
      {(form) => (
        <>
          <Row>
            <Col>
              <InputField
                suffixIcon={
                  <Button
                    variant='ghost'
                    className='p-1! hover:bg-transparent!'
                  >
                    <Search size={16} />
                  </Button>
                }
                control={form.control}
                name='title'
                className='w-85'
                placeholder='Tìm kiếm phim, diễn viên'
              />
            </Col>
          </Row>
        </>
      )}
    </BaseForm>
  );
}
