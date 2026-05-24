'use client';

/**
 * Rielt.Market Asia - Listing Detail Client Component
 * Детальная страница объявления
 */

import { useState } from 'react';
import Link from 'next/link';
import { Gallery } from '@/components/rielt/ListingDetail/Gallery';
import { Summary } from '@/components/rielt/ListingDetail/Summary';
import { Description } from '@/components/rielt/ListingDetail/Description';
import { Amenities } from '@/components/rielt/ListingDetail/Amenities';
import { HouseRules } from '@/components/rielt/ListingDetail/HouseRules';
import { AvailabilityCalendar } from '@/components/rielt/ListingDetail/AvailabilityCalendar';
import { LongTermConditions } from '@/components/rielt/ListingDetail/LongTermConditions';
import { Location } from '@/components/rielt/ListingDetail/Location';
import { Owner } from '@/components/rielt/ListingDetail/Owner';
import { Verification } from '@/components/rielt/ListingDetail/Verification';
import { CTAPanel } from '@/components/rielt/ListingDetail/CTAPanel';
import type { Listing } from '@/components/rielt/types';

interface ListingDetailClientProps {
  listing: Listing;
}

export function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const [selectedDates, setSelectedDates] = useState<{
    checkIn?: Date;
    checkOut?: Date;
  }>({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/rielt/search"
          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          К поиску объявлений
        </Link>
        <Link
          href="/rielt/inquiries"
          className="inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-100"
        >
          Мои inquiry-запросы
        </Link>
      </div>
      {/* Hero-галерея */}
      <section className="mb-8">
        <Gallery listing={listing} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основной контент */}
        <div className="lg:col-span-2 space-y-8">
          {/* Сводка */}
          <Summary listing={listing} />

          {/* Описание */}
          <Description listing={listing} />

          {/* Удобства */}
          <Amenities listing={listing} />

          {/* Домашние правила */}
          <HouseRules listing={listing} />

          {/* Календарь / Условия долгосрока */}
          {listing.rentalType === 'short-term' ? (
            <AvailabilityCalendar
              listing={listing}
              onDatesChange={setSelectedDates}
            />
          ) : (
            <LongTermConditions listing={listing} />
          )}

          {/* Локация */}
          <Location listing={listing} />

          {/* Владелец рендерим только если runtime даёт валидный owner id */}
          {listing.owner.id ? <Owner listing={listing} /> : null}

          {/* Проверки */}
          {listing.proVerification && (
            <Verification listing={listing} />
          )}
        </div>

        {/* Боковая панель (CTA) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CTAPanel
              listing={listing}
              selectedDates={selectedDates}
              onDatesChange={setSelectedDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

