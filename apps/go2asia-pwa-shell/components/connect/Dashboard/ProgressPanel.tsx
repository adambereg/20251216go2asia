'use client';

import { Card } from '@go2asia/ui';
import { Award } from 'lucide-react';

export function ProgressPanel() {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-slate-100 rounded-full">
          <Award className="w-6 h-6 text-slate-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Прогресс появится позже</h2>
          <p className="text-sm text-slate-600 mt-1">
            Уровни и сезонный прогресс будут показаны только после появления backend truth.
          </p>
        </div>
      </div>
    </Card>
  );
}

