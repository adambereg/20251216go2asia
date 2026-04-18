'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import {
  createOrganizerTrip,
  createOrganizerTripItem,
  fetchOrganizerTrips,
  type OrganizerTripSummary,
} from '@/components/space/runtime/organizerApi';
import { getErrorStatus, isServiceUnavailableStatus, SAVED_POSTS_MINE_URL } from '@/components/space/runtime/utils';

type SavedReactionRecord = {
  id: string;
  targetId: string;
  targetType: 'space_post';
  reactionType: 'bookmark';
  createdAt: string;
};

type ListMyReactionsResponse = {
  items: Array<{ reaction: SavedReactionRecord }>;
  nextCursor: string | null;
};

type SavedHydratedItem = {
  reactionId: string;
  reactionCreatedAt: string;
  post: generated.SpacePostResponse;
};

type OrganizerChooserState = 'idle' | 'loading' | 'ready' | 'auth-required' | 'unavailable' | 'error';

function pluralizeRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function deriveTripItemTitle(post: generated.SpacePostResponse): string {
  const text = post.text?.trim();
  if (text) {
    return text.length > 72 ? `${text.slice(0, 72).trim()}...` : text;
  }
  return `Сохранённый пост ${post.author.displayName}`;
}

function deriveTripItemNote(post: generated.SpacePostResponse): string | null {
  const text = post.text?.trim();
  if (!text) return 'Добавлено из сохранённых как ориентир для этой поездки.';
  return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
}

function deriveNewTripTitle(post: generated.SpacePostResponse): string {
  const text = post.text?.trim();
  if (text) {
    const compact = text.replace(/\s+/g, ' ');
    return compact.length > 48 ? compact.slice(0, 48).trim() : compact;
  }
  return 'Новая поездка';
}

export function SavedPostsPageClient() {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<SavedHydratedItem[]>([]);
  const [reactionCount, setReactionCount] = useState(0);
  const [hydrationMissingCount, setHydrationMissingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [runtimeUnavailable, setRuntimeUnavailable] = useState(false);
  const [pendingReactionIds, setPendingReactionIds] = useState<Record<string, boolean>>({});
  const [chooserReactionId, setChooserReactionId] = useState<string | null>(null);
  const [organizerTrips, setOrganizerTrips] = useState<OrganizerTripSummary[]>([]);
  const [organizerState, setOrganizerState] = useState<OrganizerChooserState>('idle');
  const [organizerError, setOrganizerError] = useState<string | null>(null);
  const [pendingTripActionId, setPendingTripActionId] = useState<string | null>(null);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [tripFeedback, setTripFeedback] = useState<{ tone: 'success' | 'error'; message: string; href?: string } | null>(null);

  const loadSavedPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuthRequired(false);
    setRuntimeUnavailable(false);
    setReactionCount(0);
    setHydrationMissingCount(0);

    try {
      const saved = await customInstance<ListMyReactionsResponse>({ method: 'GET' }, SAVED_POSTS_MINE_URL);
      setReactionCount(saved.items.length);
      if (saved.items.length === 0) {
        setItems([]);
        return;
      }

      const hydrated = await Promise.all(
        saved.items.map(async ({ reaction }) => {
          try {
            const post = await customInstance<generated.SpacePostResponse>(
              { method: 'GET' },
              `/v1/space/posts/${encodeURIComponent(reaction.targetId)}`
            );
            return {
              reactionId: reaction.id,
              reactionCreatedAt: reaction.createdAt,
              post,
            } satisfies SavedHydratedItem;
          } catch {
            return null;
          }
        })
      );

      const hydratedItems = hydrated.filter((item): item is SavedHydratedItem => item !== null);
      setItems(hydratedItems);
      setHydrationMissingCount(saved.items.length - hydratedItems.length);
    } catch (loadError) {
      const status = getErrorStatus(loadError);
      if (status === 401 || status === 403) {
        setAuthRequired(true);
      } else if (isServiceUnavailableStatus(status)) {
        setRuntimeUnavailable(true);
      } else {
        setError(`Не удалось загрузить сохранённые посты (${status ?? 'unknown'}).`);
      }
      setItems([]);
      setReactionCount(0);
      setHydrationMissingCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!isLoaded) {
      setIsLoading(true);
      setAuthRequired(false);
      return () => {
        cancelled = true;
      };
    }

    if (!isSignedIn) {
      setIsLoading(false);
      setAuthRequired(true);
      setRuntimeUnavailable(false);
      setError(null);
      setItems([]);
      setReactionCount(0);
      setHydrationMissingCount(0);
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      await loadSavedPosts();
      if (cancelled) return;
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, loadSavedPosts]);

  const ensureOrganizerTripsLoaded = useCallback(async () => {
    if (organizerState === 'loading') return false;
    if (organizerState === 'ready') return true;

    setOrganizerState('loading');
    setOrganizerError(null);
    const response = await fetchOrganizerTrips();
    if (response.data) {
      setOrganizerTrips(response.data.trips);
      setOrganizerState('ready');
      return true;
    }

    const status = getErrorStatus(response.error);
    if (status === 401 || status === 403) {
      setOrganizerTrips([]);
      setOrganizerState('auth-required');
      setOrganizerError('Нужно войти в аккаунт, чтобы добавить пост в поездку.');
      return false;
    }
    if (isServiceUnavailableStatus(status)) {
      setOrganizerTrips([]);
      setOrganizerState('unavailable');
      setOrganizerError('Сейчас список поездок недоступен. Сохранённые посты при этом остаются на месте.');
      return false;
    }
    setOrganizerTrips([]);
    setOrganizerState('error');
    setOrganizerError(`Не удалось загрузить поездки (${status ?? 'unknown'}).`);
    return false;
  }, [organizerState]);

  const openTripChooser = useCallback(
    async (item: SavedHydratedItem) => {
      setChooserReactionId(item.reactionId);
      setNewTripTitle(deriveNewTripTitle(item.post));
      setTripFeedback(null);
      setOrganizerError(null);
      await ensureOrganizerTripsLoaded();
    },
    [ensureOrganizerTripsLoaded]
  );

  const removeSaved = useCallback(async (reactionId: string) => {
    setPendingReactionIds((prev) => ({ ...prev, [reactionId]: true }));
    try {
      await customInstance<{ removed: boolean }>({ method: 'DELETE' }, `/v1/reactions/${encodeURIComponent(reactionId)}`);
      setItems((prev) => prev.filter((item) => item.reactionId !== reactionId));
      setReactionCount((prev) => Math.max(0, prev - 1));
      setError(null);
      setTripFeedback(null);
      if (chooserReactionId === reactionId) {
        setChooserReactionId(null);
      }
    } catch (removeError) {
      setError(`Не удалось убрать пост из сохранённых (${getErrorStatus(removeError) ?? 'unknown'}).`);
    } finally {
      setPendingReactionIds((prev) => {
        const next = { ...prev };
        delete next[reactionId];
        return next;
      });
    }
  }, [chooserReactionId]);

  const addSavedToTrip = useCallback(
    async (item: SavedHydratedItem, trip: OrganizerTripSummary) => {
      const actionId = `${item.reactionId}:trip:${trip.id}`;
      setPendingTripActionId(actionId);
      setTripFeedback(null);
      setOrganizerError(null);

      const response = await createOrganizerTripItem(trip.id, {
        title: deriveTripItemTitle(item.post),
        note: deriveTripItemNote(item.post),
        source: {
          module: 'space',
          entityType: 'space_post',
          entityId: item.post.id,
        },
      });

      setPendingTripActionId(null);

      if (!response.data?.item) {
        setOrganizerError(response.error?.error?.message ?? 'Не удалось добавить пост в поездку.');
        return;
      }

      setTripFeedback({
        tone: 'success',
        message:
          response.data.applied === false
            ? `Этот пост уже есть в поездке "${trip.title}". В сохранённых он по-прежнему остаётся.`
            : `Пост добавлен в поездку "${trip.title}". В сохранённых он по-прежнему остаётся.`,
        href: `/space/organizer/trips/${encodeURIComponent(trip.id)}`,
      });
      setChooserReactionId(null);
    },
    []
  );

  const createTripFromSaved = useCallback(
    async (item: SavedHydratedItem) => {
      const title = newTripTitle.trim();
      if (!title) {
        setOrganizerError('Укажите название поездки.');
        return;
      }

      const actionId = `${item.reactionId}:create-trip`;
      setPendingTripActionId(actionId);
      setTripFeedback(null);
      setOrganizerError(null);

      const tripResponse = await createOrganizerTrip({
        title,
        summary: 'Создано из сохранённого поста в Space.',
      });

      if (!tripResponse.data?.trip) {
        setPendingTripActionId(null);
        setOrganizerError(tripResponse.error?.error?.message ?? 'Не удалось создать поездку.');
        return;
      }

      const tripId = tripResponse.data.trip.id;
      const itemResponse = await createOrganizerTripItem(tripId, {
        title: deriveTripItemTitle(item.post),
        note: deriveTripItemNote(item.post),
        source: {
          module: 'space',
          entityType: 'space_post',
          entityId: item.post.id,
        },
      });

      setPendingTripActionId(null);

      if (!itemResponse.data?.item) {
        setOrganizerError(itemResponse.error?.error?.message ?? 'Поездка создана, но пост пока не удалось туда добавить.');
        setTripFeedback({
          tone: 'success',
          message: `Поездка "${title}" создана, но добавить туда этот пост не получилось. Попробуйте ещё раз уже из самой поездки.`,
          href: `/space/organizer/trips/${encodeURIComponent(tripId)}`,
        });
        return;
      }

      setOrganizerTrips((prev) => [
        {
          ...tripResponse.data!.trip,
          itemCount: 1,
          pendingTaskCount: 0,
          noteCount: 0,
        },
        ...prev,
      ]);
      setChooserReactionId(null);
      setTripFeedback({
        tone: 'success',
        message: `Создали поездку "${title}" и сразу добавили туда пост. В сохранённых он тоже остался.`,
        href: `/space/organizer/trips/${encodeURIComponent(tripId)}`,
      });
    },
    [newTripTitle]
  );

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Сохранённые посты</h1>
              <p className="mt-2 text-sm text-slate-600">
                Общий список постов, к которым вы хотите вернуться. При необходимости любой из них можно привязать к
                конкретной поездке.
              </p>
            </div>
            {reactionCount > 0 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {reactionCount} {pluralizeRu(reactionCount, 'сохранённый пост', 'сохранённых поста', 'сохранённых постов')}
              </span>
            ) : null}
          </div>
        </header>

        {!isLoading && !authRequired && !runtimeUnavailable ? (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Сохранённое остаётся общим списком интересного. Добавление в поездку не убирает пост отсюда: оно только
            связывает его с конкретной поездкой.
          </div>
        ) : null}

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем сохранённые публикации...
          </div>
        )}

        {!isLoading && authRequired && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Для раздела сохранённых нужна авторизация.
          </div>
        )}

        {!isLoading && !authRequired && runtimeUnavailable && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Сохранённые посты временно недоступны в этом окружении. Как только сервис вернётся, ваш список появится
            снова.
          </div>
        )}

        {!isLoading && !authRequired && !runtimeUnavailable && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !authRequired && !runtimeUnavailable && tripFeedback ? (
          <div
            className={`rounded-xl p-4 text-sm ${
              tripFeedback.tone === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            <div>{tripFeedback.message}</div>
            {tripFeedback.href ? (
              <div className="mt-2">
                <Link href={tripFeedback.href} className="font-medium underline underline-offset-2">
                  Открыть поездку
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !authRequired && !runtimeUnavailable && !error && items.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {reactionCount === 0
              ? 'Пока нет сохранённых постов. Когда увидите в Space что-то полезное, сохраните это сюда и потом при необходимости добавьте в поездку.'
              : 'Сохранения есть, но часть постов сейчас не удалось открыть. Попробуйте обновить страницу чуть позже.'}
          </div>
        )}

        {!isLoading && !authRequired && !runtimeUnavailable && items.length > 0 && (
          <div className="space-y-4">
            {hydrationMissingCount > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Часть сохранённых постов ({hydrationMissingCount}) временно недоступна для просмотра в этом окружении.
              </div>
            )}
            {items.map((item) => {
              const feedItem: generated.SpaceFeedItem = {
                id: `saved_${item.reactionId}`,
                createdAt: item.reactionCreatedAt,
                reason: 'author_post',
                post: item.post,
              };
              return (
                <div key={item.reactionId} className="space-y-2">
                  <SpaceFeedCard item={feedItem} showReason={false} showGroupSignal />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Сохранено в Space</span>
                    <span>Можно оставить здесь и отдельно привязать к одной или нескольким поездкам.</span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => void openTripChooser(item)}
                      disabled={pendingTripActionId !== null}
                      className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Добавить в поездку
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeSaved(item.reactionId)}
                      disabled={pendingReactionIds[item.reactionId] || pendingTripActionId !== null}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingReactionIds[item.reactionId] ? 'Удаляем...' : 'Убрать из сохранённых'}
                    </button>
                  </div>
                  {chooserReactionId === item.reactionId ? (
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                      <div className="text-sm font-medium text-slate-900">Добавить в поездку</div>
                      <p className="mt-2 text-sm text-slate-600">
                        Пост останется в сохранённых. Ниже вы либо добавите его в существующую поездку, либо сразу
                        создадите новую.
                      </p>
                      {organizerError ? <div className="mt-3 text-sm text-rose-700">{organizerError}</div> : null}
                      {organizerState === 'loading' ? (
                        <div className="mt-3 text-sm text-slate-600">Загружаем ваши поездки...</div>
                      ) : null}
                      {organizerState === 'auth-required' || organizerState === 'unavailable' || organizerState === 'error' ? (
                        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
                          {organizerError}
                        </div>
                      ) : null}
                      {organizerState === 'ready' ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Ваши поездки</div>
                            <div className="mt-3 space-y-2">
                              {organizerTrips.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">
                                  Пока нет ни одной поездки. Можно сразу создать новую и добавить туда этот пост.
                                </div>
                              ) : (
                                organizerTrips.map((trip) => {
                                  const actionId = `${item.reactionId}:trip:${trip.id}`;
                                  return (
                                    <div
                                      key={trip.id}
                                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
                                    >
                                      <div>
                                        <div className="text-sm font-medium text-slate-900">{trip.title}</div>
                                        <div className="mt-1 text-xs text-slate-500">
                                          {trip.destinationLabel ?? 'Локация пока не уточнена'} · {trip.itemCount}{' '}
                                          {pluralizeRu(trip.itemCount, 'объект', 'объекта', 'объектов')}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => void addSavedToTrip(item, trip)}
                                        disabled={pendingTripActionId !== null}
                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {pendingTripActionId === actionId ? 'Добавляем...' : 'Добавить в эту поездку'}
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          <div className="border-t border-sky-200 pt-4">
                            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Создать новую поездку</div>
                            <p className="mt-2 text-sm text-slate-600">
                              Создадим новую поездку и сразу добавим в неё этот пост. В сохранённых он при этом тоже
                              останется.
                            </p>
                            <input
                              value={newTripTitle}
                              onChange={(event) => setNewTripTitle(event.target.value)}
                              placeholder="Название поездки"
                              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-300"
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => void createTripFromSaved(item)}
                                disabled={pendingTripActionId !== null || newTripTitle.trim().length === 0}
                                className="rounded-md border border-sky-200 bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {pendingTripActionId === `${item.reactionId}:create-trip` ? 'Создаём...' : 'Создать поездку и добавить пост'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setChooserReactionId(null);
                                  setOrganizerError(null);
                                }}
                                disabled={pendingTripActionId !== null}
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Закрыть
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SpaceLayout>
  );
}

