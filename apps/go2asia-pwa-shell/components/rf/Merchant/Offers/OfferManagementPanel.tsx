'use client';

import { useEffect, useMemo, useState } from 'react';
import { activateOffer, createOffer, listPartnerItems, type RfOfferDto, type RfPartnerDto } from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import { useQuery } from '@tanstack/react-query';
import { getOfferBadge, getOfferSummaryLine, getVisibilityBadge } from '@/lib/rfFirstSliceContent';
import {
  findMerchantItemById,
  formatMerchantItemOptionLabel,
  getActiveMerchantItems,
  getOfferItemDisplayLabel,
  merchantItemOfferBindingCopy,
  normalizeOfferItemId,
} from '@/lib/rfMerchantItems';
import { upsertOffer } from '@/lib/rfOfferManagement';

const offerTypes: Array<{ value: RfOfferDto['offerType']; label: string }> = [
  { value: 'discount', label: 'Скидка' },
  { value: 'bundle', label: 'Набор' },
  { value: 'gift', label: 'Подарок' },
  { value: 'access', label: 'Доступ' },
  { value: 'campaign', label: 'Кампания' },
  { value: 'event_related', label: 'Событие' },
];

const visibilityOptions: Array<{ value: RfOfferDto['visibility']; label: string }> = [
  { value: 'public', label: 'Публично' },
  { value: 'pro_only', label: 'Только PRO' },
  { value: 'invite_only', label: 'По приглашению' },
];

function parseErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Не удалось выполнить RF-запрос.';
  const payload = error as { error?: { code?: string; message?: string }; status?: number; message?: string };
  if (payload.error?.message) return `${payload.error.code ?? 'ERROR'}: ${payload.error.message}`;
  if (payload.message) return payload.message;
  if (typeof payload.status === 'number') return `Request failed with status ${payload.status}`;
  return 'Не удалось выполнить RF-запрос.';
}

export function OfferManagementPanel({
  partner,
  offers,
  onChanged,
}: {
  partner: RfPartnerDto;
  offers: RfOfferDto[];
  onChanged?: () => void;
}) {
  const [localOffers, setLocalOffers] = useState<RfOfferDto[]>(offers);
  const [title, setTitle] = useState('');
  const [offerType, setOfferType] = useState<RfOfferDto['offerType']>('discount');
  const [visibility, setVisibility] = useState<RfOfferDto['visibility']>('public');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [creating, setCreating] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLocalOffers(offers);
  }, [offers]);

  const {
    data: itemsRes,
    isLoading: itemsLoading,
    isError: itemsError,
  } = useQuery({
    queryKey: ['rf', 'business', 'partners', partner.id, 'items'] as const,
    queryFn: () => listPartnerItems(partner.id),
    enabled: Boolean(partner.id),
    staleTime: 30_000,
    retry: 1,
  });
  const items = useMemo(() => itemsRes?.items ?? [], [itemsRes?.items]);
  const activeItems = useMemo(() => getActiveMerchantItems(items), [items]);

  useEffect(() => {
    if (selectedItemId && !findMerchantItemById(activeItems, selectedItemId)) {
      setSelectedItemId('');
    }
  }, [activeItems, selectedItemId]);

  const sortedOffers = useMemo(
    () =>
      [...localOffers].sort((a, b) => {
        if (a.status !== b.status) return a.status.localeCompare(b.status);
        return a.title.localeCompare(b.title, 'ru');
      }),
    [localOffers],
  );

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;
    setCreating(true);
    setMessage('');
    setError('');
    try {
      const itemId = normalizeOfferItemId(selectedItemId);
      const created = await createOffer(partner.id, {
        title: normalizedTitle,
        ...(itemId ? { itemId } : {}),
        offerType,
        visibility,
      });
      setLocalOffers((current) => upsertOffer(current, created));
      setTitle('');
      setSelectedItemId('');
      setMessage('Оффер создан как draft.');
      onChanged?.();
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleActivate(offerId: string) {
    setActivatingId(offerId);
    setMessage('');
    setError('');
    try {
      const activated = await activateOffer(partner.id, offerId);
      setLocalOffers((current) => upsertOffer(current, activated));
      setMessage('Оффер активирован.');
      onChanged?.();
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setActivatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Создать оффер</h3>
        <p className="mt-1 text-xs text-slate-600">{merchantItemOfferBindingCopy}</p>
        <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_240px_180px_180px_auto] xl:items-end">
          <label className="text-sm text-slate-700">
            Название
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например: скидка 10% на завтрак"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-slate-700">
            Товар или услуга
            <select
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              disabled={itemsLoading || itemsError || activeItems.length === 0}
            >
              <option value="">Без привязки</option>
              {activeItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {formatMerchantItemOptionLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-700">
            Тип
            <select
              value={offerType}
              onChange={(event) => setOfferType(event.target.value as RfOfferDto['offerType'])}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {offerTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-700">
            Доступность
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as RfOfferDto['visibility'])}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {visibilityOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="primary" disabled={creating}>
            {creating ? 'Создаём...' : 'Создать'}
          </Button>
        </div>
        {itemsLoading ? <p className="mt-2 text-xs text-slate-500">Загружаем товары и услуги…</p> : null}
        {itemsError ? (
          <p className="mt-2 text-xs text-amber-700">
            Не удалось загрузить товары и услуги. Оффер можно создать без привязки.
          </p>
        ) : null}
        {!itemsLoading && !itemsError && activeItems.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">
            Сначала добавьте товар или услугу в каталоге, либо создайте оффер без привязки.
          </p>
        ) : null}
      </form>

      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p> : null}

      {sortedOffers.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          У этого партнёра пока нет офферов. Создайте первый draft-оффер выше.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {sortedOffers.map((offer) => {
            const statusBadge = getOfferBadge(offer);
            const visibilityBadge = getVisibilityBadge(offer.visibility);
            const itemDisplayLabel = getOfferItemDisplayLabel(offer.itemId, items);
            return (
              <li key={offer.id} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{offer.title}</p>
                  <p className="text-xs text-slate-500">{getOfferSummaryLine(offer)}</p>
                  {itemDisplayLabel ? <p className="mt-1 text-xs text-slate-600">{itemDisplayLabel}</p> : null}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge.tone}`}>
                      {statusBadge.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${visibilityBadge.tone}`}>
                      {visibilityBadge.label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {offer.status === 'draft' ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleActivate(offer.id)}
                      disabled={activatingId === offer.id}
                    >
                      {activatingId === offer.id ? 'Активируем...' : 'Активировать'}
                    </Button>
                  ) : (
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      Управление статусом недоступно
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
