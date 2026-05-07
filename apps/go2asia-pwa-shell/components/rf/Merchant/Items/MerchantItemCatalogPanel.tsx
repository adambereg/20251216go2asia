'use client';

import { useMemo, useState } from 'react';
import {
  archivePartnerItem,
  createPartnerItem,
  listPartnerItems,
  type RfPartnerDto,
  type RfPartnerItemDto,
  updatePartnerItem,
} from '@go2asia/sdk/rf';
import { Button } from '@go2asia/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  formatMerchantItemPrice,
  getMerchantItemStatusLabel,
  getMerchantItemStatusTone,
  merchantItemCatalogBoundaryCopy,
  type MerchantItemFormInput,
  validateMerchantItemForm,
} from '@/lib/rfMerchantItems';

const emptyForm: MerchantItemFormInput = {
  title: '',
  description: '',
  category: '',
  priceFrom: '',
  currency: '',
};

function parseErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Не удалось выполнить RF-запрос.';
  const payload = error as { error?: { code?: string; message?: string }; status?: number; message?: string };
  if (payload.error?.message) return `${payload.error.code ?? 'ERROR'}: ${payload.error.message}`;
  if (payload.message) return payload.message;
  if (typeof payload.status === 'number') return `Request failed with status ${payload.status}`;
  return 'Не удалось выполнить RF-запрос.';
}

function formFromItem(item: RfPartnerItemDto): MerchantItemFormInput {
  return {
    title: item.title,
    description: item.description ?? '',
    category: item.category ?? '',
    priceFrom: item.priceFrom === null ? '' : String(item.priceFrom),
    currency: item.currency ?? '',
  };
}

function ItemFields({
  value,
  onChange,
  disabled = false,
}: {
  value: MerchantItemFormInput;
  onChange: (value: MerchantItemFormInput) => void;
  disabled?: boolean;
}) {
  const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100';
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="text-sm text-slate-700">
        Название
        <input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
          disabled={disabled}
          placeholder="Например: тайский массаж 60 минут"
          className={inputClass}
        />
      </label>
      <label className="text-sm text-slate-700">
        Категория
        <input
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value })}
          disabled={disabled}
          placeholder="spa, cafe, tour..."
          className={inputClass}
        />
      </label>
      <label className="text-sm text-slate-700 md:col-span-2">
        Описание
        <textarea
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          disabled={disabled}
          rows={2}
          placeholder="Кратко опишите товар или услугу"
          className={inputClass}
        />
      </label>
      <label className="text-sm text-slate-700">
        Цена от
        <input
          value={value.priceFrom}
          onChange={(event) => onChange({ ...value, priceFrom: event.target.value })}
          disabled={disabled}
          inputMode="decimal"
          placeholder="120"
          className={inputClass}
        />
      </label>
      <label className="text-sm text-slate-700">
        Валюта
        <input
          value={value.currency}
          onChange={(event) => onChange({ ...value, currency: event.target.value.toUpperCase() })}
          disabled={disabled}
          maxLength={3}
          placeholder="USD"
          className={inputClass}
        />
      </label>
    </div>
  );
}

export function MerchantItemCatalogPanel({ partner }: { partner: RfPartnerDto }) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['rf', 'business', 'partners', partner.id, 'items'] as const, [partner.id]);
  const [createForm, setCreateForm] = useState<MerchantItemFormInput>(emptyForm);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MerchantItemFormInput>(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    data: itemsRes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => listPartnerItems(partner.id),
    enabled: Boolean(partner.id),
    staleTime: 30_000,
    retry: 1,
  });

  const invalidateItems = async () => {
    await queryClient.invalidateQueries({ queryKey });
  };

  const createMutation = useMutation({
    mutationFn: (input: MerchantItemFormInput) => {
      const validation = validateMerchantItemForm(input);
      if (!validation.ok) throw new Error(validation.message);
      return createPartnerItem(partner.id, validation.value);
    },
    onSuccess: async () => {
      setCreateForm(emptyForm);
      setMessage('Товар или услуга добавлены в каталог.');
      setError('');
      await invalidateItems();
    },
    onError: (err) => {
      setError(parseErrorMessage(err));
      setMessage('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, input }: { itemId: string; input: MerchantItemFormInput }) => {
      const validation = validateMerchantItemForm(input);
      if (!validation.ok) throw new Error(validation.message);
      return updatePartnerItem(partner.id, itemId, validation.value);
    },
    onSuccess: async () => {
      setEditItemId(null);
      setEditForm(emptyForm);
      setMessage('Товар или услуга обновлены.');
      setError('');
      await invalidateItems();
    },
    onError: (err) => {
      setError(parseErrorMessage(err));
      setMessage('');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (itemId: string) => archivePartnerItem(partner.id, itemId),
    onSuccess: async () => {
      setMessage('Товар или услуга перенесены в архив.');
      setError('');
      await invalidateItems();
    },
    onError: (err) => {
      setError(parseErrorMessage(err));
      setMessage('');
    },
  });

  const items = useMemo(
    () =>
      [...(itemsRes?.items ?? [])].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [itemsRes?.items],
  );

  const beginEdit = (item: RfPartnerItemDto) => {
    setEditItemId(item.id);
    setEditForm(formFromItem(item));
    setMessage('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Добавить товар или услугу</h3>
        <p className="mt-1 text-xs text-slate-600">
          На этом этапе каталог ведётся отдельно от офферов. Привязка оффера к позиции каталога будет позже.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate(createForm);
          }}
          className="mt-4 space-y-4"
        >
          <ItemFields value={createForm} onChange={setCreateForm} disabled={createMutation.isPending} />
          <Button type="submit" variant="primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Добавляем…' : 'Добавить'}
          </Button>
        </form>
      </div>

      <p className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-950">{merchantItemCatalogBoundaryCopy}</p>

      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p> : null}

      {isLoading ? <p className="text-sm text-slate-600">Загружаем товары и услуги…</p> : null}

      {isError && !isLoading ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p>Не удалось загрузить товары и услуги.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100"
          >
            Повторить
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          У этого бизнеса пока нет товаров или услуг.
        </p>
      ) : null}

      {items.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            const isArchived = item.status === 'archived';
            const price = formatMerchantItemPrice(item.priceFrom, item.currency);
            const isEditing = editItemId === item.id;
            const archivePending = archiveMutation.isPending && archiveMutation.variables === item.id;
            return (
              <li key={item.id} className={`py-4 ${isArchived ? 'opacity-65' : ''}`}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getMerchantItemStatusTone(item.status)}`}>
                        {getMerchantItemStatusLabel(item.status)}
                      </span>
                      {item.category ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {item.category}
                        </span>
                      ) : null}
                    </div>
                    {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
                    <p className="mt-2 text-xs text-slate-500">
                      {price ? `${price} · ` : null}createdAt: {new Date(item.createdAt).toLocaleString('ru-RU')} · updatedAt:{' '}
                      {new Date(item.updatedAt).toLocaleString('ru-RU')}
                    </p>
                    {isArchived ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Архивные позиции не редактируются здесь, но позже могут оставаться контекстом старых офферов.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!isArchived ? (
                      <>
                        <Button type="button" variant="secondary" size="sm" onClick={() => beginEdit(item)}>
                          Редактировать
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={archiveMutation.isPending}
                          onClick={() => archiveMutation.mutate(item.id)}
                        >
                          {archivePending ? 'Архивируем…' : 'В архив'}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>

                {isEditing ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      updateMutation.mutate({ itemId: item.id, input: editForm });
                    }}
                    className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h4 className="text-sm font-semibold text-slate-900">Редактировать товар или услугу</h4>
                    <div className="mt-4">
                      <ItemFields value={editForm} onChange={setEditForm} disabled={updateMutation.isPending} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="submit" variant="primary" size="sm" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Сохраняем…' : 'Сохранить'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={updateMutation.isPending}
                        onClick={() => {
                          setEditItemId(null);
                          setEditForm(emptyForm);
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

