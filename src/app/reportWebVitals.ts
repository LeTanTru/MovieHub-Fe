'use client';

import type { NextWebVitalsMetric } from 'next/app';

import { useReportWebVitals } from 'next/web-vitals';

const logWebVitals = (metric: NextWebVitalsMetric) => {
  console.log(metric);
};

export function WebVitals() {
  useReportWebVitals(logWebVitals);

  return null;
}
