'use client';

import { useMemo } from 'react';
import { Button, Card, Badge, Avatar } from '@go2asia/ui';
import { Copy, Share2, Users, Store, Trophy, TrendingUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ReferralsData, Referral } from '../types';

type InviteKind = 'user' | 'business';

interface ReferralsContentProps {
  data: ReferralsData;
  onInvite: (kind: InviteKind) => void;
}

function formatCompact(n: number) {
  return n.toLocaleString('ru-RU');
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getStatusLabel(status: Referral['status']) {
  switch (status) {
    case 'active':
    case 'completed_mission':
      return 'Активен';
    case 'registered':
      return 'В ожидании';
    case 'inactive':
      return 'Неактивен';
    default:
      return status;
  }
}

function getStatusBadgeClass(status: Referral['status']) {
  switch (status) {
    case 'completed_mission':
    case 'active':
      return 'bg-emerald-100 text-emerald-700';
    case 'registered':
      return 'bg-amber-100 text-amber-800';
    case 'inactive':
      return 'bg-slate-100 text-slate-500';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export function ReferralsContent({ data, onInvite }: ReferralsContentProps) {
  const { directReferrals, subReferrals, activeCount, pendingCount } = useMemo(() => {
    const direct = data.referrals.filter((r) => !r.parent_referral_id);
    const subs = data.referrals.filter((r) => Boolean(r.parent_referral_id));
    const active = direct.filter((r) => r.status === 'active' || r.status === 'completed_mission').length;
    const pending = direct.filter((r) => r.status === 'registered').length;
    return { directReferrals: direct, subReferrals: subs, activeCount: active, pendingCount: pending };
  }, [data.referrals]);

  const goalTotal = 10;
  const goalProgress = Math.min(activeCount, goalTotal);
  const goalRemaining = Math.max(goalTotal - goalProgress, 0);
  const goalRewardPoints = 5000;

  const top3 = useMemo(() => {
    const score = (r: Referral) => r.earned_rewards.points * 1 + r.earned_rewards.g2a * 100; // условный вес
    return [...directReferrals]
      .sort((a, b) => score(b) - score(a))
      .slice(0, 3);
  }, [directReferrals]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.referral_link);
      toast.success('Ссылка скопирована');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Go2Asia — приглашение',
          text: 'Присоединяйся к Go2Asia и получай награды!',
          url: data.referral_link,
        });
        return;
      }
      await handleCopyLink();
    } catch {
      // пользователь мог отменить шаринг — это не ошибка
    }
  };

  const referralGroups = useMemo(() => {
    const partners = directReferrals.filter((r) => r.type === 'partner');
    const users = directReferrals.filter((r) => r.type === 'user');
    return { users, partners };
  }, [directReferrals]);

  const subReferralsByParent = useMemo(() => {
    const map = new Map<string, Referral[]>();
    subReferrals.forEach((r) => {
      const parentId = r.parent_referral_id;
      if (!parentId) return;
      const list = map.get(parentId) ?? [];
      list.push(r);
      map.set(parentId, list);
    });
    // стабильный порядок: по дате приглашения (новые сверху)
    for (const [k, v] of map.entries()) {
      map.set(
        k,
        [...v].sort((a, b) => new Date(b.invited_at).getTime() - new Date(a.invited_at).getTime())
      );
    }
    return map;
  }, [subReferrals]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Реферальная программа</h1>
          <p className="text-slate-600 mt-1">Приглашай друзей и партнёров — получай награды за их активность</p>
        </div>
        <Button variant="primary" onClick={() => onInvite('user')}>
          <Users size={16} className="mr-2" />
          Пригласить
        </Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Заработано</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(data.stats.earned_points)}</p>
              <p className="text-xs text-slate-500 mt-1">Points от рефералов</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Активных</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(activeCount)}</p>
              <p className="text-xs text-slate-500 mt-1">Пользователей и партнёров</p>
            </div>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <Users size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">В ожидании</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(pendingCount)}</p>
              <p className="text-xs text-slate-500 mt-1">Ещё не активировались</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <ChevronDown size={18} />
            </div>
          </div>
        </Card>
      </div>

      {/* Next goal */}
      <Card className="p-6 mb-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-rose-100 text-rose-700">Следующая цель</Badge>
              <span className="text-xs text-slate-500">Расти быстрее с бонусами</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Пригласи ещё {goalRemaining} друзей
            </h2>
            <p className="text-slate-600 mt-1">
              Прогресс: <span className="font-semibold">{goalProgress}</span> / {goalTotal} активных
            </p>
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${(goalProgress / goalTotal) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Осталось совсем немного! Пригласи ещё {goalRemaining} друзей и получи бонус.
              </p>
            </div>
          </div>

          <div className="md:w-64">
            <div className="p-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl text-white">
              <p className="text-xs opacity-90">Награда</p>
              <p className="text-2xl font-bold mt-1">{formatCompact(goalRewardPoints)} Points</p>
              <p className="text-xs opacity-90 mt-2">за достижение цели</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full bg-white/15 border-white/20 text-white hover:bg-white/20"
                onClick={() => onInvite('user')}
              >
                Пригласить сейчас
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Top 3 */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-900">Топ‑3 реферала</h3>
          </div>
          <span className="text-xs text-slate-500">Социальное доказательство</span>
        </div>

        {top3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((r, idx) => (
              <div
                key={r.id}
                className={`rounded-xl p-4 border ${
                  idx === 0
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-transparent'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={getInitials(r.name)} size="md" />
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${idx === 0 ? 'text-white' : 'text-slate-900'}`}>
                        {r.name}
                      </p>
                      <p className={`text-xs ${idx === 0 ? 'text-white/80' : 'text-slate-500'}`}>
                        {r.type === 'partner' ? 'Бизнес‑партнёр' : 'Пользователь'}
                      </p>
                    </div>
                  </div>
                  <Badge className={idx === 0 ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-700'}>
                    {idx + 1} место
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className={`text-xs ${idx === 0 ? 'text-white/80' : 'text-slate-500'}`}>Принёс</div>
                  <div className={`font-bold ${idx === 0 ? 'text-white' : 'text-slate-900'}`}>
                    {r.earned_rewards.points > 0 ? `+${r.earned_rewards.points} Points` : `+${r.earned_rewards.g2a} G2A`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-600">
            Пока нет данных. Пригласи первого друга — и он появится в рейтинге.
          </div>
        )}
      </Card>

      {/* Share now */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Поделись прямо сейчас</h3>
            <p className="text-sm text-slate-600">Каждый активный друг приносит бонусы Points</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">Осталось {goalRemaining}</Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
          <input
            readOnly
            value={data.referral_link}
            className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCopyLink}>
              <Copy size={16} className="mr-2" />
              Копировать
            </Button>
            <Button variant="primary" onClick={handleShare}>
              <Share2 size={16} className="mr-2" />
              Поделиться
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900">Пригласи пользователя</h4>
                <p className="text-sm text-slate-600 mt-1">Получай Points за активность приглашённых</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Users size={18} />
              </div>
            </div>
            <Button className="mt-4" variant="secondary" onClick={() => onInvite('user')}>
              Пригласить друга
            </Button>
          </Card>

          <Card className="p-5 bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900">Пригласи бизнес</h4>
                <p className="text-sm text-slate-600 mt-1">Получай G2A за подключение партнёров</p>
              </div>
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <Store size={18} />
              </div>
            </div>
            <Button className="mt-4" variant="secondary" onClick={() => onInvite('business')}>
              Пригласить партнёра
            </Button>
          </Card>
        </div>
      </Card>

      {/* How it works */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Как работает программа</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { n: 1, title: 'Пригласи', text: 'Поделись ссылкой с другом или партнёром' },
            { n: 2, title: 'Активируй', text: 'Друг регистрируется и делает первое действие' },
            { n: 3, title: 'Приноси пользу', text: 'Он выполняет миссии и растёт в экосистеме' },
            { n: 4, title: 'Награда', text: 'Ты получаешь Points / G2A и бонусы' },
          ].map((s) => (
            <div key={s.n} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
                {s.n}
              </div>
              <p className="font-semibold text-slate-900 mt-3">{s.title}</p>
              <p className="text-sm text-slate-600 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Двухуровневая система: бонусы за прямых рефералов и % от их рефералов (субрефералов).
        </p>
      </Card>

      {/* Your referrals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Твои рефералы</h3>
            <p className="text-sm text-slate-600">
              {referralGroups.users.length} пользователей • {referralGroups.partners.length} партнёров
              {subReferrals.length > 0 ? ` • ${subReferrals.length} субрефералов` : ''}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Двухуровневая система: прямые рефералы и субрефералы (рефералы ваших рефералов).
            </p>
          </div>
          <Button variant="secondary" onClick={() => onInvite('user')}>
            Пригласить ещё
          </Button>
        </div>

        {directReferrals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-600 font-medium">Пока нет рефералов</p>
            <p className="text-sm text-slate-500 mt-1">
              Пригласи первого друга — и начни получать бонусы Points.
            </p>
            <Button className="mt-4" variant="primary" onClick={() => onInvite('user')}>
              Пригласить первого друга
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {directReferrals.map((r) => {
              const children = subReferralsByParent.get(r.id) ?? [];
              return (
              <details key={r.id} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={getInitials(r.name)} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="font-semibold text-slate-900 truncate">{r.name}</span>
                        <Badge className={getStatusBadgeClass(r.status)}>{getStatusLabel(r.status)}</Badge>
                        {r.type === 'partner' ? (
                          <Badge className="bg-slate-100 text-slate-600">Партнёр</Badge>
                        ) : null}
                      </div>
                      <div className="text-xs text-slate-500">
                        Начисления: <span className="font-semibold text-emerald-700">+{r.earned_rewards.points}</span>{' '}
                        Points{' '}
                        {r.earned_rewards.g2a ? (
                          <>
                            • <span className="font-semibold text-teal-700">+{r.earned_rewards.g2a}</span> G2A
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] px-2 py-1 rounded-md bg-purple-100 text-purple-800 font-medium whitespace-nowrap">
                      Субрефералы: {children.length}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">Тип</div>
                      <div className="font-semibold text-slate-900">{r.type === 'partner' ? 'Бизнес' : 'Пользователь'}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">Статус</div>
                      <div className="font-semibold text-slate-900">{getStatusLabel(r.status)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">Приглашён</div>
                      <div className="font-semibold text-slate-900">
                        {new Date(r.invited_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  {typeof r.missions_completed === 'number' && typeof r.missions_total === 'number' ? (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Прогресс миссий</span>
                        <span>
                          {r.missions_completed} / {r.missions_total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all"
                          style={{
                            width: `${r.missions_total ? (r.missions_completed / r.missions_total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Sub-referrals */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-900">Субрефералы</p>
                      <p className="text-xs text-slate-500">2‑й уровень</p>
                    </div>
                    {children.length > 0 ? (
                      <div className="space-y-2">
                        {children.map((sr) => (
                          <div key={sr.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar initials={getInitials(sr.name)} size="sm" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-semibold text-slate-900 truncate">{sr.name}</span>
                                  <Badge className={getStatusBadgeClass(sr.status)}>{getStatusLabel(sr.status)}</Badge>
                                </div>
                                <div className="text-xs text-slate-500">
                                  Приглашён: {new Date(sr.invited_at).toLocaleDateString('ru-RU')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                              <div>
                                +<span className="font-semibold text-emerald-700">{sr.earned_rewards.points}</span> Points
                              </div>
                              {typeof sr.missions_completed === 'number' && typeof sr.missions_total === 'number' ? (
                                <div className="mt-1">
                                  {sr.missions_completed}/{sr.missions_total} миссий
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <p className="text-sm text-slate-600">
                          Пока нет субрефералов. Попроси этого реферала поделиться своей ссылкой — и ты начнёшь получать бонусы со 2‑го уровня.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </details>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}


