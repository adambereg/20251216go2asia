'use client';

import { Card } from '@go2asia/ui';
import { Users, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SkeletonCard } from '@go2asia/ui';

interface ReferralCodeCardProps {
  referralCode?: string;
  isLoading?: boolean;
  directReferralsCount?: number;
}

export function ReferralCodeCard({
  referralCode,
  isLoading,
  directReferralsCount,
}: ReferralCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Реферальный код скопирован в буфер обмена');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Не удалось скопировать код');
    }
  };

  const referralLink = referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/sign-up?ref=${referralCode}`
    : '';

  const handleCopyLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Реферальная ссылка скопирована в буфер обмена');
    } catch (error) {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <SkeletonCard />
      </div>
    );
  }

  if (!referralCode) {
    return (
      <Card className="p-6 mb-8">
        <div className="text-center py-8">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">
            Реферальный код будет создан автоматически при первом использовании
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Реферальный код
          </h3>
          <div className="space-y-3">
            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Ваш код
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-lg font-mono font-semibold text-slate-900">
                  {referralCode}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                  aria-label="Копировать код"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Referral Link */}
            {referralLink && (
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Реферальная ссылка
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Копировать ссылку
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-2">
              Поделитесь ссылкой с друзьями и получайте бонусы за их регистрацию!
            </p>
            {typeof directReferralsCount === 'number' && (
              <p className="text-xs text-slate-500">
                Прямых рефералов: <span className="font-semibold">{directReferralsCount}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
