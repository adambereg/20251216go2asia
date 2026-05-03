'use client';

import { useMemo } from 'react';
import { Badge, Button, Card } from '@go2asia/ui';
import { AlertCircle, CheckCircle, Clock, Copy, Gift, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ReferralsData, Referral } from '../types';

interface ReferralsContentProps {
  data: ReferralsData;
  onInvite: () => void;
}

function formatCompact(n: number) {
  return n.toLocaleString('ru-RU');
}

function getStatusLabel(status: Referral['status']) {
  switch (status) {
    case 'pending':
    case 'registered':
      return 'Ожидает активации';
    case 'activated':
    case 'active':
      return 'Активирован';
    case 'rewarded':
    case 'completed_mission':
      return 'Начислено';
    case 'reward_missing':
      return 'Начисление проверяется';
    default:
      return 'Ожидает активации';
  }
}

function getStatusBadgeClass(status: Referral['status']) {
  switch (status) {
    case 'rewarded':
    case 'completed_mission':
      return 'bg-emerald-100 text-emerald-700';
    case 'activated':
    case 'active':
      return 'bg-sky-100 text-sky-700';
    case 'pending':
    case 'registered':
      return 'bg-amber-100 text-amber-800';
    case 'reward_missing':
      return 'bg-violet-100 text-violet-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function getStatusHelperText(referral: Referral) {
  if (referral.status_helper_text) return referral.status_helper_text;
  if (referral.status === 'reward_missing') return 'Активация есть, начисление проверяется.';
  if (referral.status === 'rewarded' || referral.status === 'completed_mission') return 'Реферальные Points начислены и могут быть заблокированы до выполнения условий.';
  if (referral.status === 'activated' || referral.status === 'active') {
    return 'Пользователь стал активным, начисление может ещё обрабатываться.';
  }
  return 'Пользователь приглашён. Реферальные Points ожидают условий разблокировки.';
}

function formatDate(value: string) {
  if (!value) return 'Дата уточняется';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Дата уточняется';
  return date.toLocaleDateString('ru-RU');
}

export function ReferralsContent({ data, onInvite }: ReferralsContentProps) {
  const { totalReferrals, activatedCount, pendingCount } = useMemo(() => {
    const total = data.stats.total_users || data.referrals.length;
    const activated =
      data.stats.activated_referrals ??
      data.referrals.filter((r) => r.status === 'activated' || r.status === 'active' || r.status === 'rewarded').length;
    const pending =
      data.stats.pending_referrals ??
      data.referrals.filter((r) => r.status === 'pending' || r.status === 'registered').length;
    return {
      totalReferrals: total,
      activatedCount: activated,
      pendingCount: data.referrals.length ? pending : 0,
    };
  }, [data.referrals, data.stats]);

  const handleCopyLink = async () => {
    if (!data.referral_link) {
      toast.error('Не удалось скопировать ссылку. Скопируйте её вручную.');
      return;
    }

    try {
      await navigator.clipboard.writeText(data.referral_link);
      toast.success('Ссылка скопирована.');
    } catch {
      toast.error('Не удалось скопировать ссылку. Скопируйте её вручную.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Рефералы</h1>
          <p className="text-slate-600 mt-1">Приглашайте друзей и отслеживайте начисления Points.</p>
        </div>
        <Button variant="primary" onClick={onInvite} disabled={!data.referral_link}>
          <Users size={16} className="mr-2" />
          Пригласить
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Приглашено всего</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(totalReferrals)}</p>
            </div>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <Users size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Активировались</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(activatedCount)}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Ожидают активации</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(pendingCount)}</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Clock size={18} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Заработано Points</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCompact(data.stats.earned_points)}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Gift size={18} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Copy className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Ваша реферальная ссылка</h3>
        </div>
        {data.referral_code ? (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto] gap-3 lg:items-end">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Код приглашения</label>
              <input
                readOnly
                value={data.referral_code}
                className="w-full px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Ссылка для приглашения</label>
              <input
                readOnly
                value={data.referral_link}
                className="w-full px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700"
              />
            </div>
            <Button variant="primary" onClick={handleCopyLink}>
              <Copy size={16} className="mr-2" />
              Скопировать ссылку
            </Button>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
            <p className="text-sm text-amber-800">
              Не удалось получить код приглашения. Повторите загрузку страницы позже.
            </p>
          </div>
        )}
        <p className="text-sm text-slate-600 mt-4">
          Поделитесь ссылкой с другом. Реферальные Points могут быть заблокированы до выполнения условий активации.
        </p>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Ваши приглашения</h3>
            <p className="text-sm text-slate-600">Статусы приглашённых пользователей и начисления Points.</p>
          </div>
          <Button variant="secondary" onClick={onInvite} disabled={!data.referral_link}>
            Пригласить ещё
          </Button>
        </div>

        {data.referrals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-600 font-medium">Пока нет рефералов. Пригласите первого друга, чтобы начать.</p>
            <Button className="mt-4" variant="primary" onClick={onInvite} disabled={!data.referral_link}>
              Пригласить первого друга
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.referrals.map((referral) => (
              <Card key={referral.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">
                      <Users size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="font-semibold text-slate-900 truncate">{referral.name}</span>
                        <Badge className={getStatusBadgeClass(referral.status)}>{getStatusLabel(referral.status)}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{getStatusHelperText(referral)}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Приглашён: {formatDate(referral.invited_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-500">Начисления</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      +{formatCompact(referral.earned_rewards.points)} Points
                    </p>
                    {referral.earned_rewards.points > 0 && (
                      <p className="text-xs text-amber-700 mt-1">Заблокировано до активации условий</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


