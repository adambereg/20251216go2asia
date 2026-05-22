'use client';

/**
 * Rielt.Market Asia - Verification
 * Блок проверок (PRO, чек-лист)
 */

import { CheckCircle, Calendar } from 'lucide-react';
import type { Listing } from '../types';
import { getRieltCuratorSignalLabel } from '../copy';

interface VerificationProps {
  listing: Listing;
}

export function Verification({ listing }: VerificationProps) {
  const verification = listing.proVerification;

  if (!verification || !verification.verified) {
    return null;
  }

  const checklist = verification.checklist;

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-slate-900">{getRieltCuratorSignalLabel()}</h2>
      </div>
      <p className="mb-4 text-sm text-slate-600">
        Кураторский сигнал помогает с inquiry, но не является verified inventory, host verification или
        подтверждением доступности.
      </p>

      {/* Информация о проверке */}
      {verification.verifiedAt && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Calendar className="w-4 h-4" />
            <span>
              Отмечено куратором {new Date(verification.verifiedAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      )}

      {/* Чек-лист */}
      {checklist && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Что отмечено для запроса:</h3>
          <div className="space-y-2">
            {checklist.photosMatch && (
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Фото подходят для первичного просмотра</span>
              </div>
            )}
            {checklist.condition && (
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Состояние вынесено в inquiry-контекст</span>
              </div>
            )}
            {checklist.description && (
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Описание можно использовать для уточнения деталей</span>
              </div>
            )}
            {checklist.noise && (
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Уровень шума приемлемый</span>
              </div>
            )}
            {checklist.internet && (
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Интернет работает стабильно</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Заметки PRO */}
      {verification.notes && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">Заметки куратора:</h3>
          <p className="text-slate-700">{verification.notes}</p>
        </div>
      )}
    </div>
  );
}

