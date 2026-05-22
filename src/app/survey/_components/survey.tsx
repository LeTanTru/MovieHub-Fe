'use client';

import { Col, Row } from '@/components/form';
import { SurveyInfo } from './survey-info';
import { SurveyList } from './survey-list';
import { logoWithText } from '@/assets';
import Image from 'next/image';
import Link from 'next/link';
import { route } from '@/routes';

export function Survey() {
  return (
    <div className='h-screen'>
      <header className='bg-fixed-header block p-4'>
        <Link href={route.home.path}>
          <Image
            alt='Logo'
            className='max-1360:h-9 max-1360:w-auto max-640:h-7.5 h-auto'
            height={46}
            src={logoWithText}
            loading='eager'
            unoptimized
          />
        </Link>
        <h1 className='sr-only'>Khảo sát</h1>
      </header>
      <Row className='w-full px-12 py-20'>
        <Col className='grid-c-4'>
          <SurveyInfo />
        </Col>
        <Col className='grid-c-8 pl-20'>
          <SurveyList />
        </Col>
      </Row>
    </div>
  );
}
