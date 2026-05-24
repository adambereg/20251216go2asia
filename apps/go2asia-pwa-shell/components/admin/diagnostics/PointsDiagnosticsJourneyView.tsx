import Link from 'next/link';
import { parseSupportLookupPointer } from '@/lib/projectionMetadata';
import { PROJECTION_HELPERS } from '@/components/shared/projection';

type PointsDiagnosticsJourneyViewProps = {
  supportLookupKey?: string;
  projectionKind?: string;
  referenceScope?: string;
};

function getOwnerEntityLabel(value: string | undefined): string {
  if (value === 'user_balances') return 'owner row: user_balances';
  if (value === 'points_transactions') return 'owner family: points_transactions';
  return 'owner entity: unknown';
}

export function PointsDiagnosticsJourneyView({
  supportLookupKey,
  projectionKind,
  referenceScope,
}: PointsDiagnosticsJourneyViewProps) {
  const parsed = parseSupportLookupPointer(supportLookupKey);

  return (
    <main className="container mx-auto py-10 space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Internal diagnostics: Points support lookup
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Internal-only navigation layer для операторов. Экран показывает диагностический
          контекст и owner-fact pointers, но не является customer-proof, не закрывает support-кейс
          и не выполняет административные решения.
        </p>
        <p className="mt-2 text-xs text-slate-500">{PROJECTION_HELPERS.diagnosticsInternalOnly}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Projection metadata context</h2>
        <div className="mt-3 grid gap-2 text-sm text-slate-700">
          <p>
            Projection kind: <span className="font-medium">{projectionKind ?? 'unknown'}</span>
          </p>
          <p>
            Reference scope: <span className="font-medium">{referenceScope ?? 'unknown'}</span>
          </p>
          <p className="break-all">
            Support lookup key:{' '}
            <span className="font-medium">{supportLookupKey ?? 'not provided'}</span>
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Support lookup pointer</h2>
        {parsed ? (
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>
              Namespace: <span className="font-medium">{parsed.ownerNamespace}</span>
            </p>
            <p>
              Owner pointer: <span className="font-medium">{getOwnerEntityLabel(parsed.ownerEntity)}</span>
            </p>
            <p className="break-all">
              Owner lookup id: <span className="font-medium">{parsed.ownerLookupId}</span>
            </p>
            <p className="text-xs text-slate-500">
              Lookup pointer помогает навигации к owner domain, но не переносит authority.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Support lookup key не передан или некорректен. Для continuity передайте
            параметр <code>supportLookupKey</code> из projection metadata.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Safe operational navigation</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/connect/activity" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
            Connect activity
          </Link>
          <Link href="/rf/pro/verifications" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
            PRO verifications
          </Link>
          <Link href="/rf/pro/partners" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
            PRO partners
          </Link>
          <Link href="/quest" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
            Quest runtime context
          </Link>
          <Link href="/rielt/inquiries" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
            Rielt inquiries
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          cross-module trace != immutable history. Используйте owner-backed домены для
          финальной проверки фактов.
        </p>
      </section>
    </main>
  );
}
