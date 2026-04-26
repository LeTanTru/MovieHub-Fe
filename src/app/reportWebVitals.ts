'use client';

import type { NextWebVitalsMetric } from 'next/app';

import { useReportWebVitals } from 'next/web-vitals';

const logWebVitals = (_metric: NextWebVitalsMetric) => {};

export function WebVitals() {
  useReportWebVitals(logWebVitals);

  return null;
}
