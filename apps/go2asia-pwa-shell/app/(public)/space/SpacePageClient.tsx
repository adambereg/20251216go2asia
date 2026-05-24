"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { customInstance, generated } from "@go2asia/sdk";
import { SpaceLayout } from "@/components/space/Shared";
import { SpaceFeedCard } from "@/components/space/runtime/SpaceFeedCard";
import { useSpaceHomeFeed } from "@/components/space/runtime/useSpaceHomeFeed";
import { useSpaceSavedReactions } from "@/components/space/runtime/useSpaceSavedReactions";
import { PUBLIC_PROFILE_ID } from "@/components/space/runtime/utils";

type HeaderSurfaceState = "loading" | "ready" | "error" | "generic";

type SavedPreviewItem = {
  reactionId: string;
  createdAt: string;
  post: generated.SpacePostResponse;
};

type DashboardSignalSource = "runtime" | "summary" | "reference";

type DashboardActionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  source: DashboardSignalSource;
  priority?: "high" | "medium" | "low";
  state?: "planned" | "pending" | "waiting";
};

const quickEntries = [
  {
    href: "/space/community",
    title: "Сообщества",
    description:
      "Найти подходящую группу и затем перейти в group detail или открыть центральную ленту отдельно.",
  },
  {
    href: "/space/posts",
    title: "Публикации",
    description: "Перейти к авторским публикациям и public profile baseline.",
  },
  {
    href: "/space/activity",
    title: "Активность",
    description: "Проверить недавние действия и narrow activity timeline.",
  },
  {
    href: "/space/saved",
    title: "Сохранённые",
    description: "Вернуться к сохранённым постам, если bookmark runtime доступен.",
  },
] as const;

const referenceBlocks = [
  {
    title: "Ecosystem Signals",
    status: "Summary",
    description: "Сводка смежных доменов без переноса прав владения в Space.",
  },
  {
    title: "AI Assistant Suggestions",
    status: "Preview",
    description: "Небольшой preview AI слоя без operational loop.",
  },
  {
    title: "PRO Widget",
    status: "Preview",
    description: "Спокойный переход к PRO visibility без замены рабочих контуров.",
  },
] as const;

const organizerEntryHref = "/space/organizer";

function formatSourceLabel(source: DashboardSignalSource): string {
  switch (source) {
    case "runtime":
      return "Live";
    case "summary":
      return "Summary";
    case "reference":
      return "Preview";
    default:
      return "Preview";
  }
}

function formatPriorityLabel(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Medium";
  }
}

export function SpacePageClient() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { mode, feed, isLoading: isFeedLoading, error: feedError } = useSpaceHomeFeed();
  const saved = useSpaceSavedReactions(true);
  const [headerProfile, setHeaderProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [headerState, setHeaderState] = useState<HeaderSurfaceState>("loading");
  const [savedPreview, setSavedPreview] = useState<SavedPreviewItem[]>([]);
  const [savedPreviewLoading, setSavedPreviewLoading] = useState(false);
  const [savedPreviewHydrationMisses, setSavedPreviewHydrationMisses] = useState(0);

  const headerUserId = useMemo(() => {
    if (isSignedIn && user?.id) return user.id;
    if (PUBLIC_PROFILE_ID) return PUBLIC_PROFILE_ID;
    return null;
  }, [isSignedIn, user?.id]);

  const pulsePreviewItems = useMemo(() => feed?.items.slice(0, 2) ?? [], [feed]);

  const todayItems = useMemo<DashboardActionItem[]>(() => {
    const items: DashboardActionItem[] = [];

    if (saved.state === "ready" && saved.savedCount > 0) {
      items.push({
        id: "today_saved_follow_up",
        title: "Вернуться к сохранённому shortlist",
        description: `У вас ${saved.savedCount} сохранённых постов — хороший момент выбрать 1–2 и сделать следующий шаг.`,
        href: "/space/saved",
        cta: "Открыть сохранённые",
        source: "runtime",
      });
    }

    if (pulsePreviewItems.length > 0) {
      items.push({
        id: "today_social_change",
        title: "Проверить свежие social изменения",
        description: `В Social Pulse уже есть ${pulsePreviewItems.length} живых сигнала(ов) — стоит быстро пройтись по потоку.`,
        href: "/space/feed",
        cta: "Открыть ленту",
        source: "runtime",
      });
    }

    if (headerProfile?.cityId) {
      items.push({
        id: "today_city_context",
        title: `Сверить городской контекст: ${headerProfile.cityId}`,
        description:
          "Локальные сообщества помогают быстрее перейти от ориентирования к полезному участию.",
        href: "/space/community",
        cta: "Открыть сообщества",
        source: "summary",
      });
    }

    if (items.length === 0) {
      items.push({
        id: "today_start_light",
        title: "Сформировать первый дневной фокус",
        description:
          "Если сигналов пока мало, начните с одного сообщества и одного небольшого действия.",
        href: "/space/community",
        cta: "Выбрать группу",
        source: "reference",
      });
    }

    return items.slice(0, 3);
  }, [saved.state, saved.savedCount, pulsePreviewItems.length, headerProfile?.cityId]);

  const nextActionItems = useMemo<DashboardActionItem[]>(() => {
    const items: DashboardActionItem[] = [
      {
        id: "next_enter_community",
        title: "Выбрать группу для входа",
        description:
          "Community root теперь показывает карту входа: проще выбрать, где встроиться сначала.",
        href: "/space/community",
        cta: "Открыть сообщества",
        source: "summary",
      },
    ];

    if (saved.state === "ready" && saved.savedCount > 0) {
      items.push({
        id: "next_convert_saved",
        title: "Преобразовать сохранённое в действие",
        description:
          "Возьмите один сохранённый пост и решите, что сделать сегодня: открыть, обсудить или зафиксировать шаг.",
        href: "/space/saved",
        cta: "Перейти в сохранённые",
        source: "runtime",
      });
    } else {
      items.push({
        id: "next_build_shortlist",
        title: "Собрать небольшой shortlist",
        description:
          "Даже 1–2 сохранения дадут более полезный контекст для следующих действий на dashboard.",
        href: "/space/feed",
        cta: "Открыть ленту",
        source: "reference",
      });
    }

    const isPro = headerProfile?.roleLabel?.toLowerCase().includes("pro");
    items.push(
      isPro
        ? {
            id: "next_group_rhythm",
            title: "Поддержать ритм группы",
            description:
              "Один содержательный апдейт в группе часто лучше длинного списка отложенных задач.",
            href: "/space/community",
            cta: "Открыть сообщества",
            source: "summary",
          }
        : {
            id: "next_authored_update",
            title: "Сделать короткую авторскую публикацию",
            description: "Небольшой пост может превратить обычный просмотр в активное включение.",
            href: "/space/posts",
            cta: "Открыть публикации",
            source: "summary",
          }
    );

    return items;
  }, [saved.state, saved.savedCount, headerProfile?.roleLabel]);

  const organizerPreviewItems = useMemo<DashboardActionItem[]>(() => {
    const first: DashboardActionItem =
      saved.state === "ready" && saved.savedCount > 0
        ? {
            id: "organizer_saved",
            title: "Вернуться к shortlist и принять решение",
            description:
              "Organizer уже открыт как отдельная секция shell. Следующий честный шаг — зайти внутрь и увидеть bounded state без fake trips.",
            href: organizerEntryHref,
            cta: "Открыть Organizer",
            source: "summary",
            state: "planned",
            priority: "high",
          }
        : {
            id: "organizer_seed",
            title: "Открыть Organizer как новую section",
            description:
              "Даже при пустом shortlist Organizer уже существует как честный route inside Space и не притворяется полноценным planner.",
            href: organizerEntryHref,
            cta: "Открыть Organizer",
            source: "reference",
            state: "planned",
            priority: "high",
          };

    return [
      first,
      {
        id: "organizer_community",
        title: "Перейти в Organizer из dashboard shell",
        description:
          "Dashboard остаётся cockpit, а Organizer теперь открывается как более глубокий bounded mode внутри Space.",
        href: organizerEntryHref,
        cta: "Перейти",
        source: "reference",
        state: "planned",
        priority: "medium",
      },
      {
        id: "organizer_activity",
        title: "Проверить thin Organizer state",
        description:
          "Если planner runtime ещё не развернут полностью, route всё равно показывает honest loading/empty/auth/thin states.",
        href: organizerEntryHref,
        cta: "Перейти",
        source: "runtime",
        state: "waiting",
        priority: "low",
      },
    ];
  }, [saved.state, saved.savedCount]);

  useEffect(() => {
    let cancelled = false;

    async function loadHeaderProfile() {
      if (!isLoaded) return;
      if (!headerUserId) {
        setHeaderProfile(null);
        setHeaderState("generic");
        return;
      }

      setHeaderState("loading");
      try {
        const profile = await customInstance<generated.SpaceProfileResponse>(
          { method: "GET" },
          `/v1/space/profiles/${encodeURIComponent(headerUserId)}`
        );
        if (cancelled) return;
        setHeaderProfile(profile);
        setHeaderState("ready");
      } catch {
        if (cancelled) return;
        setHeaderProfile(null);
        setHeaderState("generic");
      }
    }

    void loadHeaderProfile();
    return () => {
      cancelled = true;
    };
  }, [headerUserId, isLoaded]);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedPreview() {
      if (saved.state !== "ready" || saved.savedReactions.length === 0) {
        setSavedPreview([]);
        setSavedPreviewHydrationMisses(0);
        return;
      }

      const previewTargets = saved.savedReactions.slice(0, 2);
      setSavedPreviewLoading(true);

      try {
        const hydrated = await Promise.all(
          previewTargets.map(async (reaction) => {
            try {
              const post = await customInstance<generated.SpacePostResponse>(
                { method: "GET" },
                `/v1/space/posts/${encodeURIComponent(reaction.targetId)}`
              );
              return {
                reactionId: reaction.id,
                createdAt: reaction.createdAt ?? post.createdAt,
                post,
              } satisfies SavedPreviewItem;
            } catch {
              return null;
            }
          })
        );

        if (cancelled) return;
        const hydratedItems = hydrated.filter((item): item is SavedPreviewItem => item !== null);
        setSavedPreview(hydratedItems);
        setSavedPreviewHydrationMisses(previewTargets.length - hydratedItems.length);
      } finally {
        if (!cancelled) setSavedPreviewLoading(false);
      }
    }

    void loadSavedPreview();
    return () => {
      cancelled = true;
    };
  }, [saved.savedReactions, saved.state]);

  const headerTitle =
    headerProfile?.displayName ?? user?.fullName ?? user?.firstName ?? "Space Dashboard";

  const headerDescription = headerProfile?.bioShort
    ? headerProfile.bioShort
    : mode === "home"
      ? "Персональная social-панель с мягким входом в активные поверхности Space."
      : mode === "public-profile"
        ? "Гостевой профильный preview в режиме ограниченной видимости."
        : "Часть social-слоя временно ограничена, поэтому экран работает в облегчённом режиме.";

  return (
    <SpaceLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Space Asia</h1>
              <p className="mt-2 text-sm text-slate-600">
                Social dashboard-точка входа: сначала сориентироваться, затем перейти в нужную
                поверхность.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              {mode === "home" && "Персональный social режим активен."}
              {mode === "public-profile" && "Показан гостевой social preview."}
              {mode === "deferred" &&
                "Часть social-слоя недоступна, поэтому экран работает в облегчённом режиме."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Link
                href="/profile"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50"
              >
                Профиль
              </Link>
              <Link
                href="/connect/activity"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-900 hover:bg-emerald-100"
              >
                Connect activity
              </Link>
              <Link
                href="/"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>
            </div>
          </header>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Ваш контекст</h2>
            <p className="mt-1 text-sm text-slate-600">
              Кого показывает dashboard сейчас и сколько живых social сигналов уже доступно.
            </p>
          </div>

          {headerState === "loading" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Загружаем профиль для dashboard header...
            </div>
          )}

          {headerState !== "loading" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900">{headerTitle}</h3>
                {headerProfile?.roleLabel && (
                  <span className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-sky-800">
                    {headerProfile.roleLabel}
                  </span>
                )}
                {!isSignedIn && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                    guest preview
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-700">{headerDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {headerProfile?.cityId && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                    City: {headerProfile.cityId}
                  </span>
                )}
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                  Сохранённые:{" "}
                  {saved.state === "ready"
                    ? saved.savedCount
                    : saved.state === "unavailable"
                      ? "временно недоступно"
                      : saved.state === "error"
                        ? "ошибка"
                        : isSignedIn
                          ? "загрузка"
                          : "нужен вход"}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Today</h2>
              <p className="mt-1 text-sm text-slate-600">
                1-3 дневных акцента, чтобы быстро перейти от контекста к конкретному шагу.
              </p>
            </div>
            <div className="space-y-3">
              {todayItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {formatSourceLabel(item.source)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {item.cta}
                  </Link>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Next Actions</h2>
              <p className="mt-1 text-sm text-slate-600">
                Рекомендованные шаги на ближайший цикл, без имитации workflow-движка.
              </p>
            </div>
            <div className="space-y-3">
              {nextActionItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {formatSourceLabel(item.source)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {item.cta}
                  </Link>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Organizer Preview</h2>
              <p className="mt-1 text-sm text-slate-600">
                Organizer больше не только preview-обещание: это уже реальная shell section внутри
                Space с честными bounded states.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                shell inserted
              </span>
              <Link
                href={organizerEntryHref}
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Открыть Organizer
              </Link>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {organizerPreviewItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                    {formatSourceLabel(item.source)}
                  </span>
                  {item.state && (
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                      {item.state}
                    </span>
                  )}
                  {item.priority && (
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600">
                      {formatPriorityLabel(item.priority)}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-3 inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Secondary Previews</h2>
              <p className="mt-1 text-sm text-slate-600">
                Спокойные входы в уже живые surfaces без перегрузки основного decision-layer.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickEntries.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-slate-100"
                >
                  <div className="text-sm font-semibold text-slate-900">{entry.title}</div>
                  <p className="mt-2 text-xs text-slate-600">{entry.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Saved Preview</h2>
              <p className="mt-1 text-sm text-slate-600">
                Короткий доступ к сохранённым постам без перегрузки dashboard.
              </p>
            </div>

            {saved.state === "loading" && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Загружаем сохранённые публикации...
              </div>
            )}

            {saved.state === "auth-required" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Войдите, чтобы увидеть персональный saved preview и полный список в `/space/saved`.
              </div>
            )}

            {saved.state === "unavailable" && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Saved preview временно недоступен в этом окружении. Остальные social surfaces
                продолжают работать.
              </div>
            )}

            {saved.state === "error" && saved.error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {saved.error}
              </div>
            )}

            {saved.state === "ready" && saved.savedCount === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Пока нет сохранённых публикаций. Начните с ленты или полного списка публикаций.
              </div>
            )}

            {saved.state === "ready" && saved.savedCount > 0 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Всего сохранённых постов:{" "}
                  <span className="font-semibold">{saved.savedCount}</span>
                </div>
                {savedPreviewLoading && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Готовим preview сохранённых постов...
                  </div>
                )}
                {!savedPreviewLoading && savedPreview.length === 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    {savedPreviewHydrationMisses > 0
                      ? "Сохранения найдены, но preview постов сейчас не удалось загрузить. Полный список доступен через `/space/saved`."
                      : "Preview сейчас не удалось загрузить. Полный список остаётся доступным через `/space/saved`."}
                  </div>
                )}
                {savedPreview.length > 0 && savedPreviewHydrationMisses > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    Часть сохранённых постов ({savedPreviewHydrationMisses}) временно не попала в
                    preview.
                  </div>
                )}
                {savedPreview.map((item) => {
                  const feedItem: generated.SpaceFeedItem = {
                    id: `saved_preview_${item.reactionId}`,
                    createdAt: item.createdAt,
                    reason: "author_post",
                    post: item.post,
                  };
                  return (
                    <SpaceFeedCard
                      key={item.reactionId}
                      item={feedItem}
                      showReason={false}
                      showGroupSignal
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Social Pulse</h2>
              <p className="mt-1 text-sm text-slate-600">
                Короткий preview центральной ленты. Полный поток публикаций доступен отдельно на
                `/space/feed`.
              </p>
            </div>
            <Link
              href="/space/feed"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Открыть ленту
            </Link>
          </div>

          {isFeedLoading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Загружаем social pulse preview...
            </div>
          )}

          {!isFeedLoading && feedError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {feedError}
            </div>
          )}

          {!isFeedLoading && !feedError && pulsePreviewItems.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Пока здесь мало сигналов. Полная лента остаётся доступной как отдельная surface.
            </div>
          )}

          {!isFeedLoading && pulsePreviewItems.length > 0 && (
            <div className="space-y-4">
              {pulsePreviewItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <SpaceFeedCard item={item} showReason showGroupSignal />
                  {saved.state === "ready" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => void saved.toggleSaved(item.post.id)}
                        disabled={saved.isPending(item.post.id)}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saved.isPending(item.post.id)
                          ? "Обновляем..."
                          : saved.isSaved(item.post.id)
                            ? "Убрать из сохранённых"
                            : "Сохранить пост"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Следующие слои</h2>
            <p className="mt-1 text-sm text-slate-600">
              Спокойные preview и summary-блоки, которые задают направление, но не притворяются
              отдельными live-сервисами.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {referenceBlocks.map((block) => (
              <article
                key={block.title}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{block.title}</h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {block.status}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">{block.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SpaceLayout>
  );
}
