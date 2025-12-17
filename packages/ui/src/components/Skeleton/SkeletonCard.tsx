'use client';

import React from 'react';
import { Card } from '../Card';
import { Skeleton } from './Skeleton';

export const SkeletonCard: React.FC = () => {
  return (
    <Card>
      <Skeleton className="h-48 w-full mb-4 rounded-lg" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </Card>
  );
};
