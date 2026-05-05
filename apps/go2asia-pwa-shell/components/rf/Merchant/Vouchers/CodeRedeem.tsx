'use client';

import { useState } from 'react';
import { redeemRfVoucher } from '@go2asia/sdk/rf';
import { Card, CardContent, Button } from '@go2asia/ui';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

type LiveRedeemResult = {
  applied: boolean;
  voucherId: string;
  partnerId: string;
  offerId: string;
  status: string;
  canonicalStatus: string | null;
  redeemedAt: string | null;
  statusChangedAt: string | null;
};

type LiveRedeemError = {
  status: number | null;
  code: string;
  message: string;
};

function toLiveRedeemError(error: unknown): LiveRedeemError {
  const value = error as {
    status?: number;
    error?: { code?: string; message?: string };
    message?: string;
  };

  return {
    status: typeof value?.status === 'number' ? value.status : null,
    code: value?.error?.code || 'RF_REDEEM_FAILED',
    message: value?.error?.message || value?.message || 'Не удалось погасить ваучер.',
  };
}

export function CodeRedeem() {
  const [partnerId, setPartnerId] = useState('');
  const [voucherId, setVoucherId] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveResult, setLiveResult] = useState<LiveRedeemResult | null>(null);
  const [liveError, setLiveError] = useState<LiveRedeemError | null>(null);

  const handleRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPartnerId = partnerId.trim();
    const normalizedVoucherId = voucherId.trim();

    if (!normalizedPartnerId || !normalizedVoucherId) {
      setLiveResult(null);
      setLiveError({
        status: null,
        code: 'RF_REDEEM_INPUT_REQUIRED',
        message: 'partnerId и код ваучера/voucherId обязательны для погашения.',
      });
      return;
    }

    setLiveLoading(true);
    setLiveError(null);
    setLiveResult(null);

    try {
      const response = await redeemRfVoucher({
        partnerId: normalizedPartnerId,
        voucherId: normalizedVoucherId,
        idempotencyKey: idempotencyKey.trim() || undefined,
      });
      setLiveResult({
        applied: response.applied,
        voucherId: response.voucher.id,
        partnerId: response.voucher.partnerId,
        offerId: response.voucher.offerId,
        status: response.voucher.status,
        canonicalStatus: response.voucher.canonicalStatus ?? null,
        redeemedAt: response.voucher.redeemedAt,
        statusChangedAt: response.voucher.statusChangedAt ?? null,
      });
    } catch (error) {
      setLiveError(toLiveRedeemError(error));
    } finally {
      setLiveLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Погашение ваучера</h3>
            <p className="mt-1 text-sm text-slate-600">
              Проверяет ваучер через RF backend и фиксирует погашение для выбранного партнёра.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleRedeem}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ID партнёра</label>
              <input
                type="text"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                placeholder="rf_partner_..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Введите код ваучера</label>
              <input
                type="text"
                value={voucherId}
                onChange={(e) => setVoucherId(e.target.value)}
                placeholder="rf_voucher_..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Используйте идентификатор ваучера из RF. Человекочитаемый поиск по коду появится в следующих версиях.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Idempotency-Key (опционально)</label>
              <input
                type="text"
                value={idempotencyKey}
                onChange={(e) => setIdempotencyKey(e.target.value)}
                placeholder="redeem-..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Если оставить пустым, backend всё равно защищает от второго successful redeem по voucherId.
              </p>
            </div>

            <Button type="submit" variant="primary" disabled={liveLoading} className="w-full">
              {liveLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Погашаем...
                </span>
              ) : (
                'Погасить'
              )}
            </Button>

            {liveResult ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={18} />
                  {liveResult.applied ? 'Ваучер погашен' : 'Ваучер уже был погашен'}
                </div>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <p>voucherId: {liveResult.voucherId}</p>
                  <p>partnerId: {liveResult.partnerId}</p>
                  <p>offerId: {liveResult.offerId}</p>
                  <p>status: {liveResult.status}</p>
                  {liveResult.canonicalStatus ? <p>canonicalStatus: {liveResult.canonicalStatus}</p> : null}
                  {liveResult.redeemedAt ? <p>redeemedAt: {new Date(liveResult.redeemedAt).toLocaleString('ru-RU')}</p> : null}
                  {liveResult.statusChangedAt ? (
                    <p>statusChangedAt: {new Date(liveResult.statusChangedAt).toLocaleString('ru-RU')}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {liveError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <div className="flex items-center gap-2 font-medium">
                  <XCircle size={18} />
                  {liveError.code}
                </div>
                <p className="mt-1">{liveError.message}</p>
                {liveError.status !== null ? <p className="mt-1 text-xs">HTTP {liveError.status}</p> : null}
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

