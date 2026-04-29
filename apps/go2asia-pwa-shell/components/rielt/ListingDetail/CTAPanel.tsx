'use client';

/**
 * Rielt.Market Asia - CTAPanel
 * Sticky panel with voucher-first discovery flow.
 */

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Share2 } from 'lucide-react';
import { createListingInquiry } from '@go2asia/sdk/rielt';
import type { Listing } from '../types';

interface CTAPanelProps {
  listing: Listing;
  selectedDates: { checkIn?: Date; checkOut?: Date };
  onDatesChange: (dates: { checkIn?: Date; checkOut?: Date }) => void;
}

function buildRfVoucherRoute(listing: Listing): string {
  if (listing.rfPartnerId) {
    return `/rf/vouchers?partner=${encodeURIComponent(listing.rfPartnerId)}`;
  }

  return '/rf/vouchers';
}

export function CTAPanel({ listing, selectedDates, onDatesChange }: CTAPanelProps) {
  void selectedDates;
  void onDatesChange;
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactTelegram, setContactTelegram] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [inquiryText, setInquiryText] = useState('');

  const price = listing.rentalType === 'long-term' 
    ? listing.pricing.perMonth 
    : listing.pricing.perNight;

  const priceLabel = listing.rentalType === 'long-term' ? 'месяц' : 'ночь';
  const voucherCount = listing.presentation?.vouchersCount ?? 0;
  const hasRfTruth = Boolean(listing.rfPartnerId);
  const rfCatalogHref = buildRfVoucherRoute(listing);
  const primaryCtaLabel = hasRfTruth
    ? listing.presentation?.primaryCtaLabel || (listing.rfVoucher ? 'Открыть предложение' : 'Открыть RF-предложения')
    : 'Смотреть похожие варианты';
  const primaryCtaHref = hasRfTruth ? rfCatalogHref : '/rielt/search';
  const secondaryVoucherCta = hasRfTruth ? listing.presentation?.secondaryCtaLabel : undefined;

  const buildIdempotencyKey = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `rielt-inquiry-${crypto.randomUUID()}`;
    }
    return `rielt-inquiry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  };

  const handleRequest = async () => {
    if (!message.trim()) {
      setInquiryStatus('error');
      setInquiryText('Введите сообщение для уточнения.');
      return;
    }

    setInquiryStatus('submitting');
    setInquiryText('');

    try {
      await createListingInquiry(
        listing.id,
        {
          message: message.trim(),
          contact_name: contactName.trim() || null,
          contact_phone: contactPhone.trim() || null,
          contact_telegram: contactTelegram.trim() || null,
        },
        buildIdempotencyKey()
      );
      setInquiryStatus('success');
      setInquiryText('Сообщение отправлено.');
      setMessage('');
    } catch (error) {
      const payload = error as { error?: { code?: string; message?: string }; status?: number };
      const errorMessage = payload?.error?.message ?? 'Не удалось отправить сообщение. Попробуйте ещё раз.';
      setInquiryStatus('error');
      setInquiryText(errorMessage);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        });
      } catch (err) {
        // Пользователь отменил шаринг
      }
    } else {
      // Fallback: копирование в буфер обмена
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 sticky top-24">
      {/* Цена */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-slate-900">
            ${price}
          </span>
          <span className="text-lg text-slate-600">/ {priceLabel}</span>
        </div>
        {listing.pricing.cleaningFee && (
          <div className="text-sm text-slate-500">
            + ${listing.pricing.cleaningFee} уборка
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 p-3 mb-5">
        <p className="text-xs text-slate-600">
          Rielt показывает объект и контекст размещения. Ваучеры и RF-предложения открываются в RF Asia; Rielt не подтверждает бронирование.
        </p>
      </div>

      <Link
        href={primaryCtaHref}
        className="mb-5 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        {primaryCtaLabel}
      </Link>

      {hasRfTruth ? (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-bold">RF</span>
            <span className="text-sm font-semibold text-emerald-900">
              {listing.rfVoucher?.title ?? (voucherCount > 0 ? `Ваучеров: ${voucherCount}` : 'Russian Friendly контекст')}
            </span>
          </div>
          <p className="text-sm text-emerald-800 mb-3">
            {listing.rfVoucher?.description ??
              'Для этого объекта есть RF-сигнал. Активация и условия ваучеров остаются в RF Asia.'}
          </p>
          {secondaryVoucherCta ? (
            <Link
              href={rfCatalogHref}
              className="mt-2 block w-full rounded-lg border border-emerald-300 px-4 py-2 text-center font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              {secondaryVoucherCta}
            </Link>
          ) : null}
          <p className="text-xs text-emerald-800 mt-2">
            Получение и активация ваучеров происходят в RF Asia. Rielt не подтверждает бронирование.
          </p>
        </div>
      ) : null}

      {/* Кнопки действий */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Оставить сообщение по объекту
        </h3>
        <p className="text-xs text-slate-500">
          Это вторичный канал для уточнения деталей размещения после выбора подходящего варианта.
        </p>
        <div className="space-y-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm"
            placeholder="Напишите, какие детали размещения хотите уточнить"
          />
          <input
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm"
            placeholder="Имя (необязательно)"
          />
          <input
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm"
            placeholder="Телефон (необязательно)"
          />
          <input
            value={contactTelegram}
            onChange={(event) => setContactTelegram(event.target.value)}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm"
            placeholder="Telegram (необязательно)"
          />
          <button
            onClick={handleRequest}
            disabled={inquiryStatus === 'submitting'}
            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-semibold transition-colors"
          >
            {inquiryStatus === 'submitting' ? 'Отправка...' : 'Отправить сообщение'}
          </button>
          {inquiryText ? (
            <p className={inquiryStatus === 'success' ? 'text-xs text-emerald-700' : 'text-xs text-red-700'}>
              {inquiryText}
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            Сохранить
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
        </div>
      </div>

      {listing.presentation?.trustLabel ? (
        <div className="mt-4 text-xs text-slate-600">{listing.presentation.trustLabel}</div>
      ) : null}
    </div>
  );
}

