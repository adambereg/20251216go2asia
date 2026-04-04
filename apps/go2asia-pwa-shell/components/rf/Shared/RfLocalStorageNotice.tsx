'use client';

export function RfLocalStorageNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs text-amber-950">
      {children}
    </div>
  );
}
