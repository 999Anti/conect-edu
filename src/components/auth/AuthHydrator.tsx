'use client';

import { useEffect } from 'react';
import { useStore } from '@store/auth';

export default function AuthHydrator() {
  const initialize = useStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}

