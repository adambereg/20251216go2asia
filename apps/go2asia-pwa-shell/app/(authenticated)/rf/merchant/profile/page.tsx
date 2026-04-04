'use client';

import { useEffect } from 'react';

/**
 * Профиль сведён к секции #mw-profile в общей сводке кабинета.
 */
export default function MerchantProfilePage() {
  useEffect(() => {
    window.location.replace('/rf/merchant#mw-profile');
  }, []);

  return (
    <p className="text-sm text-slate-600">
      Перенаправляем в кабинет, раздел «Профиль»…
    </p>
  );
}
