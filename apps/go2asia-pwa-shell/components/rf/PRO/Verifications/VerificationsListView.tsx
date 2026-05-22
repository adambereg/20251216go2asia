'use client';

import { Button, Card, CardContent } from '@go2asia/ui';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function VerificationsListView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Проверки (deferred)</h1>
        <p className="text-slate-600">
          Verification workflow PRO снят с active mock-рендера до подключения подтверждённого
          runtime source.
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <AlertTriangle size={20} aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Operational workflow не подключён</h2>
              <p className="mt-1 text-sm text-slate-700">
                Здесь больше не показываются demo-чек-листы, статусы одобрения или карточки
                проверки партнёров. Действия на этой поверхности не записываются в backend и
                не являются support-proof.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-4 text-sm text-slate-700">
            <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
              <ShieldCheck size={16} aria-hidden />
              Runtime boundary
            </div>
            <p>
              Проверка партнёров должна опираться на owner-backed RF source. Этот экран не
              подтверждает verification status, payout, cashback, settlement или operational
              assignment.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/rf/pro#pw-linked-partners">
              <Button size="sm" className="gap-1">
                Открыть live связи PRO
                <ArrowRight size={14} aria-hidden />
              </Button>
            </Link>
            <Link href="/rf/pro">
              <Button variant="secondary" size="sm">
                Вернуться в PRO workspace
              </Button>
            </Link>
            <Link href="/rf/vouchers">
              <Button variant="secondary" size="sm">
                RF ваучеры
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

