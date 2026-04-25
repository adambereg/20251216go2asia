'use client';

import { ConnectHero, ConnectNav } from '../Shared';
import { Badge, Card } from '@go2asia/ui';
import { ArrowRight, Award, Compass, Users } from 'lucide-react';
import Link from 'next/link';

const guidanceItems = [
  {
    title: 'Пройти квест',
    description: 'Найдите доступные квесты в Quest Asia.',
    href: '/quest',
    icon: Compass,
  },
  {
    title: 'Пригласить друга',
    description: 'Поделитесь реферальной ссылкой.',
    href: '/connect/referrals',
    icon: Users,
  },
  {
    title: 'Посмотреть бейджи',
    description: 'Узнайте, какие достижения уже доступны.',
    href: '/connect/levels',
    icon: Award,
  },
];

export function MissionsView() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Персональные задания появятся позже. Пока начните с квестов, приглашений и бейджей." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Миссии</h1>
          <p className="text-slate-600 mt-1">
            Персональные задания появятся позже. Пока начните с квестов, приглашений и бейджей.
          </p>
        </div>

        <Card className="p-6 mb-6 bg-amber-50 border border-amber-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-amber-900">Персональные задания появятся позже</h2>
              <p className="text-sm text-amber-900/80 mt-2">
                Connect пока не ведёт отдельные миссии. Вы можете проходить квесты в Quest Asia, приглашать друзей и получать бейджи за реальные действия.
              </p>
            </div>
            <Badge className="bg-amber-100 text-amber-800">Появится позже</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Что можно сделать сейчас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidanceItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-4 bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-sky-700 w-fit mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  <Link href={item.href} className="inline-flex items-center text-sm text-sky-700 hover:underline underline-offset-2 mt-4">
                    Перейти
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

