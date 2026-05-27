'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';

export function AuthInit() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
