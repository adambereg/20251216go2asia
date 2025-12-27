'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@go2asia/ui';

interface DemoModeBannerProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function DemoModeBanner({ title, description, onRetry, retryLabel }: DemoModeBannerProps) {
  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900 mb-1">{title ?? 'DEMO MODE / fallback'}</p>
          <p className="text-xs text-amber-900/80">
            {description ??
              'Не удалось загрузить данные из API. Показаны демо-данные, чтобы UI оставался доступным для проверки.'}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (onRetry ? onRetry() : window.location.reload())}
            className="mt-3 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {retryLabel ?? 'Попробовать снова'}
          </Button>
        </div>
      </div>
    </div>
  );
}



