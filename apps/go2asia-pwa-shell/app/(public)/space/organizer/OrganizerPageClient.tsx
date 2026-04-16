'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { SpaceLayout } from '@/components/space/Shared';
import { useSpaceSavedReactions } from '@/components/space/runtime/useSpaceSavedReactions';

export function OrganizerPageClient() {
  const { isLoaded, isSignedIn } = useUser();
  const saved = useSpaceSavedReactions(isLoaded && isSignedIn);

  return (
    <SpaceLayout>
      <section className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Organizer</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Честная Phase 1 shell section внутри `Space Asia`: отдельная точка входа в future trip-first
                workflow без фальшивой полноты и без подмены dashboard-first природы всего Space.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              shell insertion only
            </span>
          </div>
        </header>

        {!isLoaded && (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Загрузка Organizer</h2>
            <p className="mt-2 text-sm text-slate-600">
              Подготавливаем shell section и проверяем, какие честные состояния доступны для текущей session.
            </p>
          </article>
        )}

        {isLoaded && !isSignedIn && (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-900">Нужна авторизация</h2>
            <p className="mt-2 text-sm text-amber-800">
              Organizer открыт как реальная секция внутри Space, но персональный planning context пока доступен только
              в авторизованной session.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/space"
                className="inline-flex rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
              >
                Вернуться на dashboard
              </Link>
              <Link
                href="/space/community/feed"
                className="inline-flex rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
              >
                Открыть поток постов
              </Link>
            </div>
          </article>
        )}

        {isLoaded && isSignedIn && saved.state === 'loading' && (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Подготавливаем Organizer context</h2>
            <p className="mt-2 text-sm text-slate-600">
              Пока проверяем доступный saved source и готовим bounded Phase 1 state без попытки рисовать trip data,
              которого ещё нет в runtime truth.
            </p>
          </article>
        )}

        {isLoaded && isSignedIn && saved.state === 'ready' && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Пока нет trip containers</h2>
              <p className="mt-2 text-sm text-slate-600">
                Organizer уже существует как отдельная секция shell, но полный trip model и saved-to-trip flow ещё не
                открыты в этом bounded Phase 1 pass.
              </p>

              {saved.savedCount > 0 ? (
                <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
                  <div className="text-sm font-medium text-sky-900">Saved source уже доступен</div>
                  <p className="mt-2 text-sm text-sky-800">
                    В вашем shortlist сейчас {saved.savedCount} сохранённых публикаций. Это хороший честный вход в
                    будущий Organizer flow, но пока без fake trip completeness.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/space/saved"
                      className="inline-flex rounded-md border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-100"
                    >
                      Открыть Saved
                    </Link>
                    <span className="inline-flex rounded-md border border-sky-200 bg-white px-3 py-1.5 text-xs font-medium text-sky-700">
                      add-to-trip comes next
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">Saved shortlist пока пуст</div>
                  <p className="mt-2 text-sm text-slate-600">
                    Чтобы будущий Organizer получил полезный source layer, сначала сохраните 1-2 публикации из social
                    surfaces Space.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/space/community/feed"
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Открыть Feed
                    </Link>
                    <Link
                      href="/space/saved"
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Проверить Saved
                    </Link>
                  </div>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Что реально открыто сейчас</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  Organizer уже виден как отдельная primary section inside Space.
                </li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  Dashboard preview теперь ведёт в реальный Organizer route.
                </li>
                <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  Space остаётся шире Organizer: Saved, Activity, Communities и Feed живут как самостоятельные sections.
                </li>
              </ul>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold text-amber-900">Что сознательно не включено</h3>
                <ul className="mt-2 space-y-2 text-xs text-amber-800">
                  <li>- нет fake trips и trip CRUD</li>
                  <li>- нет map/day planner/comparison/AI workspace</li>
                  <li>- нет нового planner truth inside `space-service`</li>
                </ul>
              </div>
            </article>
          </div>
        )}

        {isLoaded && isSignedIn && (saved.state === 'unavailable' || saved.state === 'error') && (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Thin mode</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Organizer shell уже открыт, но supporting read state сейчас неполный. Вместо fake planner data section
                  остаётся в честном thin состоянии.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                bounded truth
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {saved.error ?? 'Saved source временно недоступен в этом окружении.'}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/space"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Вернуться на dashboard
              </Link>
              <Link
                href="/space/activity"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Открыть Activity
              </Link>
            </div>
          </article>
        )}
      </section>
    </SpaceLayout>
  );
}
