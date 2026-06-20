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
    <div className='min-h-dvh'>
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
      <Row className='max-1536:px-10 max-1280:px-8 max-1120:py-16 max-990:py-8 max-990:px-4 max-640:py-6 max-480:py-4 mx-auto! w-full px-12 py-20'>
        <Col className='grid-c-4 max-990:grid-c-12 p-0!'>
          <SurveyInfo />
        </Col>
        <Col className='grid-c-8 max-1600:pl-10 max-1280:pl-6 max-990:grid-c-12 max-640:mt-4 max-990:mt-6 max-990:pl-0 pr-0 pl-20'>
          <SurveyList />
        </Col>
      </Row>
    </div>
  );
}
