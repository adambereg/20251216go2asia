'use client';

import { useState } from 'react';
import { Button } from '@go2asia/ui';
import { createBusinessPartner, fetchMyVouchers, type RfPartnerDto, type RfVoucherDto } from '@go2asia/sdk/rf';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function parseErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Unexpected error';
  const payload = error as { error?: { code?: string; message?: string }; status?: number };
  if (payload.error?.message) return `${payload.error.code ?? 'ERROR'}: ${payload.error.message}`;
  if (typeof payload.status === 'number') return `Request failed with status ${payload.status}`;
  return 'Unexpected error';
}

export function RfBusinessCreatePanel() {
  const [displayName, setDisplayName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [atlasPlaceId, setAtlasPlaceId] = useState('');
  const [hostAtlasPlaceId, setHostAtlasPlaceId] = useState('');

  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [createdPartner, setCreatedPartner] = useState<RfPartnerDto | null>(null);

  const [voucherLoading, setVoucherLoading] = useState(false);
  const [vouchers, setVouchers] = useState<RfVoucherDto[] | null>(null);
  const [voucherError, setVoucherError] = useState<string>('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');
    setSubmitMessage('');

    try {
      const partner = await createBusinessPartner({
        displayName: displayName.trim(),
        countryId: countryId.trim(),
        cityId: cityId.trim(),
        atlasPlaceId: atlasPlaceId.trim() || null,
        hostAtlasPlaceId: hostAtlasPlaceId.trim() || null,
      });
      setCreatedPartner(partner);
      setSubmitState('success');
      setSubmitMessage('Partner created via live RF API.');
    } catch (error) {
      setSubmitState('error');
      setSubmitMessage(parseErrorMessage(error));
    }
  }

  async function loadMyVouchers() {
    setVoucherLoading(true);
    setVoucherError('');
    try {
      const response = await fetchMyVouchers();
      if (!response) {
        setVoucherError('Unable to load vouchers right now.');
        setVouchers(null);
      } else {
        setVouchers(response.items);
      }
    } finally {
      setVoucherLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create RF business partner</h2>
        <p className="text-sm text-slate-600 mt-2">
          Live endpoint: <code>POST /v1/rf/business/partners</code>. Place refs are optional; do not invent values.
        </p>
        <form className="grid gap-4 mt-5 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="text-sm text-slate-700 md:col-span-2">
            Display name
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-slate-700">
            Country ID
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              value={countryId}
              onChange={(event) => setCountryId(event.target.value)}
              placeholder="country_th"
              required
            />
          </label>
          <label className="text-sm text-slate-700">
            City ID
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              value={cityId}
              onChange={(event) => setCityId(event.target.value)}
              placeholder="city_phuket"
              required
            />
          </label>
          <label className="text-sm text-slate-700">
            Atlas place ID (optional)
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              value={atlasPlaceId}
              onChange={(event) => setAtlasPlaceId(event.target.value)}
              placeholder="place_..."
            />
          </label>
          <label className="text-sm text-slate-700">
            Host Atlas place ID (optional)
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              value={hostAtlasPlaceId}
              onChange={(event) => setHostAtlasPlaceId(event.target.value)}
              placeholder="place_..."
            />
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" variant="primary" disabled={submitState === 'submitting'}>
              {submitState === 'submitting' ? 'Creating...' : 'Create partner'}
            </Button>
            {submitMessage ? (
              <span className={submitState === 'error' ? 'text-sm text-red-700' : 'text-sm text-emerald-700'}>
                {submitMessage}
              </span>
            ) : null}
          </div>
        </form>
      </section>

      {createdPartner ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Created partner</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
            {JSON.stringify(createdPartner, null, 2)}
          </pre>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900">My vouchers (live read)</h3>
          <Button type="button" variant="secondary" onClick={loadMyVouchers} disabled={voucherLoading}>
            {voucherLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Uses <code>GET /v1/rf/me/vouchers</code>. Requires authenticated session.
        </p>
        {voucherError ? <p className="text-sm text-red-700 mt-3">{voucherError}</p> : null}
        {vouchers ? (
          vouchers.length === 0 ? (
            <p className="text-sm text-slate-600 mt-3">No vouchers found for current account.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {vouchers.map((voucher) => (
                <li key={voucher.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-medium text-slate-900">{voucher.code}</p>
                  <p className="text-slate-600 text-xs mt-1">
                    status: {voucher.status} · partnerId: {voucher.partnerId} · offerId: {voucher.offerId}
                  </p>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </section>
    </div>
  );
}
