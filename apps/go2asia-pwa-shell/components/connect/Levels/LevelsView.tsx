'use client';

import { ConnectHero, ConnectNav } from '../Shared';
import { LevelProgress } from './LevelProgress';
import { AchievementsList } from './AchievementsList';
import { Card, Badge } from '@go2asia/ui';
import { Lock, Unlock, Sparkles } from 'lucide-react';
import type { LevelsData } from '../types';
import { mockLevelsData } from '../mockData';
import { getDataSource } from '@/mocks/dto';

interface LevelsViewProps {
  initialData?: LevelsData;
}

export function LevelsView({ initialData = mockLevelsData }: LevelsViewProps) {
  const dataSource = getDataSource();
  const currentLevel = initialData.level.current;
  const nextLevel = currentLevel + 1;

  const levels = Array.from({ length: 10 }, (_, i) => {
    const lvl = i + 1;
    const locked = lvl > currentLevel;
    const benefits: string[] = [
      lvl === 1 ? 'Базовый доступ к экосистеме' : '',
      lvl === 2 ? 'Множитель Points +5%' : '',
      lvl === 3 ? 'Доступ к ежедневным миссиям' : '',
      lvl === 4 ? 'Множитель Points +10%' : '',
      lvl === 5 ? 'Доступ к сезонным миссиям' : '',
      lvl === 6 ? 'Приоритетные награды' : '',
      lvl === 7 ? 'Спецпредложения от партнёров' : '',
      lvl === 8 ? 'Множитель Points +20%' : '',
      lvl === 9 ? 'Доступ к эксклюзивным ивентам' : '',
      lvl === 10 ? 'Максимальный множитель +30%' : '',
    ].filter(Boolean);
    return { lvl, locked, benefits };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined} />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Уровни и достижения</h1>
          <p className="text-slate-600 mt-1">Твой прогресс в экосистеме Go2Asia</p>
        </div>

        {/* Прогресс уровня */}
        <LevelProgress level={initialData.level} />

        {/* Что откроется на следующем уровне */}
        <Card className="p-6 mb-8 bg-purple-50 border border-purple-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Что откроется на уровне {nextLevel}</h2>
                <p className="text-sm text-purple-900/80 mt-1">
                  Продолжай качать XP, чтобы получить новые возможности
                </p>
              </div>
            </div>
            <Badge className="bg-purple-200 text-purple-800">Скоро</Badge>
          </div>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-900/90">
            <li>→ Приоритетный доступ к событиям</li>
            <li>→ Специальные предложения от партнёров</li>
            <li>→ Ускоренный рост XP</li>
            <li>→ Бонус к наградам в сезоне</li>
          </ul>
          <p className="text-xs text-purple-900/70 mt-3">
            Зачем повышать уровень? Каждый новый уровень даёт реальную ценность: больше возможностей и ускоренный рост.
          </p>
        </Card>

        {/* Все уровни */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Все уровни</h2>
          <div className="space-y-3">
            {levels.map(({ lvl, locked, benefits }) => (
              <Card
                key={lvl}
                className={`p-4 border ${
                  lvl === currentLevel
                    ? 'border-emerald-300 bg-emerald-50'
                    : locked
                      ? 'border-slate-200 bg-white opacity-80'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        locked ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">Уровень {lvl}</p>
                        {lvl === currentLevel ? (
                          <Badge className="bg-emerald-200 text-emerald-800">Текущий</Badge>
                        ) : locked ? (
                          <Badge className="bg-slate-100 text-slate-600">Закрыт</Badge>
                        ) : null}
                      </div>
                      {benefits.length > 0 ? (
                        <p className="text-sm text-slate-600 mt-1">{benefits[0]}</p>
                      ) : (
                        <p className="text-sm text-slate-600 mt-1">—</p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 text-right">
                    {locked ? 'ещё не доступен' : 'доступен'}
                  </div>
                </div>
                {benefits.length > 1 ? (
                  <ul className="mt-3 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-1">
                    {benefits.slice(1).map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            ))}
          </div>
        </div>

        {/* Достижения */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Достижения</h2>
          <AchievementsList achievements={initialData.achievements} />
        </div>
      </div>
    </div>
  );
}

