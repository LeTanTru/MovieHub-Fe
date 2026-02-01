'use client';

import envConfig from '@/config';
import { logger } from '@/logger';

let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();

  if (currentTime >= lastTime + 1000) {
    const fps = Math.round((frames * 1000) / (currentTime - lastTime));
    logger.info(`FPS: ${fps}`);

    if (fps < 60) {
      logger.warn('⚠️ Scroll bị giật! FPS thấp:', fps);
    }

    frames = 0;
    lastTime = currentTime;
  }

  requestAnimationFrame(measureFPS);
}

export default function PerformanceMonitor() {
  if (
    typeof window !== 'undefined' &&
    envConfig.NEXT_PUBLIC_NODE_ENV !== 'developement'
  ) {
    measureFPS();
  }

  // useEffect(() => {
  //   if ('PerformanceObserver' in window) {
  //     const observer = new PerformanceObserver((list) => {
  //       for (const entry of list.getEntries()) {
  //         if (entry.duration > 50) {
  //           logger.warn('⚠️ Long Task detected:', {
  //             duration: entry.duration.toFixed(2) + 'ms',
  //             name: entry.name,
  //             entry
  //           });
  //         }
  //       }
  //     });

  //     observer.observe({ entryTypes: ['longtask', 'measure'] });

  //     return () => observer.disconnect();
  //   }
  // }, []);

  return null;
}
