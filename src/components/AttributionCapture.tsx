'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/tracking';

/**
 * Records first-touch attribution (landing page, referrer, UTMs) on whatever
 * page a visit starts on. Mounted once in the root layout; captureAttribution()
 * is a no-op once a first touch is stored, so it can never overwrite one.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
