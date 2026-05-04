'use client';

import { useState } from 'react';
import { redeemRfVoucher } from '@go2asia/sdk/rf';
import { Card, CardContent, Button, Badge } from '@go2asia/ui';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';

type LiveRedeemResult = {
  applied: boolean;
  voucherId: string;
  status: string;
  canonicalStatus: string | null;
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
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [partnerId, setPartnerId] = useState('');
  const [voucherId, setVoucherId] = useState('');
  const [gatewayAuthToken, setGatewayAuthToken] = useState('');
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveResult, setLiveResult] = useState<LiveRedeemResult | null>(null);
  const [liveError, setLiveError] = useState<LiveRedeemError | null>(null);

  const handleRedeem = () => {
    // Заглушка: имитация погашения ваучера
    if (code.length >= 6) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setCode('');
      }, 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const handleLiveRedeem = async () => {
    const normalizedPartnerId = partnerId.trim();
    const normalizedVoucherId = voucherId.trim();

    if (!normalizedPartnerId || !normalizedVoucherId) {
      setLiveResult(null);
      setLiveError({
        status: null,
        code: 'RF_REDEEM_INPUT_REQUIRED',
        message: 'partnerId и voucherId обязательны для live smoke.',
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
        gatewayAuthToken: gatewayAuthToken.trim() || undefined,
      });
      setLiveResult({
        applied: response.applied,
        voucherId: response.voucher.id,
        status: response.voucher.status,
        canonicalStatus: response.voucher.canonicalStatus ?? null,
      });
    } catch (error) {
      setLiveError(toLiveRedeemError(error));
    } finally {
      setLiveLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-amber-200">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Live redeem smoke</h3>
            <Badge variant="info">staging</Badge>
          </div>

          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 shrink-0" size={18} />
              <p>
                Операция live redeem изменит статус ваучера на redeemed и создаст запись в истории погашения.
                Используйте только staging/test voucher.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">partnerId</label>
              <input
                type="text"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                placeholder="rf_partner_..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">voucherId</label>
              <input
                type="text"
                value={voucherId}
                onChange={(e) => setVoucherId(e.target.value)}
                placeholder="rf_voucher_..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <details className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <summary className="cursor-pointer font-medium text-slate-800">Gateway token override</summary>
              <p className="mt-2 text-xs text-slate-500">
                Обычно используется текущая authenticated session. Заполняйте только для ручного gateway smoke.
              </p>
              <textarea
                value={gatewayAuthToken}
                onChange={(e) => setGatewayAuthToken(e.target.value)}
                placeholder="Optional X-Gateway-Auth token"
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </details>

            <Button variant="primary" onClick={handleLiveRedeem} disabled={liveLoading} className="w-full">
              {liveLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Погашаем...
                </span>
              ) : (
                'Погасить live'
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
                  <p>status: {liveResult.status}</p>
                  {liveResult.canonicalStatus ? <p>canonicalStatus: {liveResult.canonicalStatus}</p> : null}
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
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Demo redeem fallback</h3>
            <Badge variant="info">demo</Badge>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Введите код ваучера</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 size={20} />
                <span className="font-medium">Ваучер успешно погашен!</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle size={20} />
                <span className="font-medium">Неверный код ваучера</span>
              </div>
            )}
            <Button variant="secondary" onClick={handleRedeem} className="w-full">
              Погасить demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

