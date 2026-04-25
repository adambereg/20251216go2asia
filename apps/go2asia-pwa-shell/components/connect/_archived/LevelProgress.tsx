'use client';

// Legacy Connect artifact. Do not reuse without backend-truth validation.
import { Card } from '@go2asia/ui';
import { Award } from 'lucide-react';
import type { Level } from '../types';

interface LevelProgressProps {
  level: Level;
}

export function LevelProgress(_props: LevelProgressProps) {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Бейджи и достижения</h2>
          <p className="text-sm text-slate-600 mt-1">Система уровней появится позже.</p>
        </div>
        <div className="p-3 bg-emerald-100 rounded-full">
          <Award className="w-8 h-8 text-emerald-600" />
        </div>
      </div>
    </Card>
  );
}

