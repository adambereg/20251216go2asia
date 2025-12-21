'use client';

import { useState, useMemo } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { Card } from '@go2asia/ui';
import { MissionCard } from './MissionCard';
import { MissionFilters } from './MissionFilters';
import { Target, Sparkles, Lock } from 'lucide-react';
import type { MissionsData, ModuleType, MissionType, MissionStatus } from '../types';
import { mockMissionsData } from '../mockData';
import { getDataSource } from '@/mocks/dto';

interface MissionsViewProps {
  initialData?: MissionsData;
}

export function MissionsView({ initialData = mockMissionsData }: MissionsViewProps) {
  const dataSource = getDataSource();
  const [selectedModule, setSelectedModule] = useState<ModuleType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MissionType | 'all'>('all');
  const [selectedStatus] = useState<MissionStatus | 'all'>('all');

  const kpi = useMemo(() => {
    const total = initialData.missions.length;
    const active = initialData.missions.filter((m) => m.status === 'new' || m.status === 'in_progress').length;
    const completed = initialData.missions.filter((m) => m.status === 'completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, active, completed, percent };
  }, [initialData.missions]);

  const recommended = useMemo(() => {
    return initialData.missions
      .filter((m) => m.status === 'new')
      .slice(0, 3);
  }, [initialData.missions]);

  const filteredMissions = useMemo(() => {
    let result = [...initialData.missions];

    if (selectedModule !== 'all') {
      result = result.filter((mission) => mission.module === selectedModule);
    }

    if (selectedType !== 'all') {
      result = result.filter((mission) => mission.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((mission) => mission.status === selectedStatus);
    }

    return result;
  }, [initialData.missions, selectedModule, selectedType, selectedStatus]);

  const handleStart = (deeplink: string) => {
    window.location.href = deeplink;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" badgeText={dataSource === 'mock' ? 'MOCK DATA' : undefined} />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Миссии</h1>
          <p className="text-slate-600 mt-1">
            Выполняйте задания и получайте награды
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <p className="text-sm text-slate-600">Активных миссий</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.active}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-600">Завершено</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.completed}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-600">Процент выполнения</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.percent}%</p>
          </Card>
        </div>

        {/* Рекомендуем начать */}
        <Card className="p-6 mb-6 bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-lg font-semibold text-amber-900">Рекомендуем начать</h2>
              <p className="text-sm text-amber-900/80">Персональные миссии специально для тебя</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.map((mission) => (
              <div key={mission.id}>
                <MissionCard mission={mission} onStart={() => handleStart(mission.deeplink)} />
              </div>
            ))}
          </div>
        </Card>

        {/* Фильтры */}
        <MissionFilters
          selectedModule={selectedModule}
          selectedType={selectedType}
          onModuleChange={setSelectedModule}
          onTypeChange={setSelectedType}
          showStatus={false}
        />

        {/* Список миссий */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {filteredMissions.length} {filteredMissions.length === 1 ? 'миссия' : 'миссий'}
          </h2>
          {filteredMissions.length > 0 ? (
            <div className="space-y-3">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onStart={() => handleStart(mission.deeplink)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-slate-500 mb-2">Миссии не найдены</p>
              <p className="text-sm text-slate-400">
                Попробуйте изменить фильтры или проверьте позже
              </p>
            </Card>
          )}
        </div>

        {/* Скоро откроются */}
        <Card className="p-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-purple-700" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Скоро откроются</h2>
              <p className="text-sm text-slate-600">Повышай уровень, чтобы получить доступ</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-slate-50 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Мастер контента</p>
                  <p className="text-sm text-slate-600 mt-1">Опубликуй 10 постов в Blog</p>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">+1500 XP</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Требуется: Уровень 6</p>
            </Card>
            <Card className="p-4 bg-slate-50 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Сетевой специалист</p>
                  <p className="text-sm text-slate-600 mt-1">Пригласи 5 активных рефералов</p>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">+2000 XP</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Требуется: Уровень 7</p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}

