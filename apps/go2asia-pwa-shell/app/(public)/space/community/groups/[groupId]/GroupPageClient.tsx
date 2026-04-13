'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { customInstance, generated } from '@go2asia/sdk';
import { SpaceLayout } from '@/components/space/Shared';
import { SpaceFeedCard } from '@/components/space/runtime/SpaceFeedCard';
import {
  getErrorStatus,
  getGroupFeedUrl,
  getProfileHref,
  spaceNoContentRequest,
} from '@/components/space/runtime/utils';

type GroupPageClientProps = {
  groupId: string;
};

export function GroupPageClient({ groupId }: GroupPageClientProps) {
  const [group, setGroup] = useState<generated.SpaceGroupResponse | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<generated.SpaceProfileResponse | null>(null);
  const [feed, setFeed] = useState<generated.SpaceFeedResponse | null>(null);
  const [membershipState, setMembershipState] = useState<'unknown' | 'active' | 'left'>('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGroupSurface() {
      setIsLoading(true);
      setError(null);

      try {
        const groupResponse = await customInstance<generated.SpaceGroupResponse>(
          { method: 'GET' },
          `/v1/space/groups/${encodeURIComponent(groupId)}`
        );
        const [feedResponse, ownerResponse] = await Promise.all([
          customInstance<generated.SpaceFeedResponse>(
            { method: 'GET' },
            getGroupFeedUrl(groupResponse.id)
          ),
          customInstance<generated.SpaceProfileResponse>(
            { method: 'GET' },
            `/v1/space/profiles/${encodeURIComponent(groupResponse.ownerId)}`
          ).catch(() => null),
        ]);

        if (cancelled) return;
        setGroup(groupResponse);
        setFeed(feedResponse);
        setOwnerProfile(ownerResponse);
      } catch (loadError) {
        if (cancelled) return;
        setGroup(null);
        setFeed(null);
        setOwnerProfile(null);
        setError(`Public group runtime request failed (${getErrorStatus(loadError) ?? 'unknown'}).`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadGroupSurface();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  async function handleJoin() {
    if (!group) return;
    setIsActionLoading(true);
    setActionMessage(null);
    try {
      await customInstance<generated.SpaceGroupMembershipResponse>(
        { method: 'POST' },
        `/v1/space/groups/${encodeURIComponent(group.id)}/join`
      );
      setMembershipState('active');
      setActionMessage('Membership baseline active. Повторный join остаётся идемпотентным.');
    } catch (joinError) {
      const status = getErrorStatus(joinError);
      if (status === 401 || status === 403) {
        setActionMessage('Для join нужен авторизованный runtime session.');
      } else {
        setActionMessage(`Join failed (${status ?? 'unknown'}).`);
      }
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!group) return;
    setIsActionLoading(true);
    setActionMessage(null);
    try {
      await spaceNoContentRequest(`/v1/space/groups/${encodeURIComponent(group.id)}/leave`);
      setMembershipState('left');
      setActionMessage('Membership removed from the public baseline.');
    } catch (leaveError) {
      const status = getErrorStatus(leaveError);
      if (status === 401 || status === 403) {
        setActionMessage('Для leave нужен авторизованный runtime session.');
      } else {
        setActionMessage(`Leave failed (${status ?? 'unknown'}).`);
      }
    } finally {
      setIsActionLoading(false);
    }
  }

  return (
    <SpaceLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Public group surface</h1>
          <p className="mt-2 text-sm text-slate-600">
            Bounded public group identity and feed baseline on existing Space runtime.
          </p>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Загружаем публичную группу...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && group && (
          <>
            <section className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">{group.title}</h2>
                <span className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-sky-800">
                  {group.visibility}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
                  {group.status}
                </span>
              </div>
              {group.description && (
                <p className="mt-3 text-sm text-slate-700">{group.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Members: {group.membersCount}</span>
                <span>
                  Owner:{' '}
                  <Link
                    href={getProfileHref(group.ownerId)}
                    className="font-medium text-slate-700 hover:text-sky-700"
                  >
                    {ownerProfile?.displayName ?? group.ownerId}
                  </Link>
                </span>
                <span>Group ID: {group.id}</span>
              </div>
            </section>

            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">Public membership baseline</h3>
              <p className="mt-2 text-xs text-slate-600">
                Этот slice покрывает только public join/leave behavior. Private и invite-only flows
                остаются вне scope.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {membershipState === 'active' ? (
                  <button
                    type="button"
                    onClick={() => {
                      void handleLeave();
                    }}
                    disabled={isActionLoading}
                    className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 disabled:opacity-60"
                  >
                    {isActionLoading ? 'Leaving...' : 'Leave public group'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      void handleJoin();
                    }}
                    disabled={isActionLoading}
                    className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 disabled:opacity-60"
                  >
                    {isActionLoading ? 'Joining...' : 'Join public group'}
                  </button>
                )}
              </div>
              {actionMessage && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  {actionMessage}
                </div>
              )}
            </section>

            {feed && feed.items.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                В этой публичной группе пока нет видимых публикаций.
              </div>
            )}

            {feed && feed.items.length > 0 && (
              <div className="space-y-4">
                {feed.items.map((item) => (
                  <SpaceFeedCard
                    key={item.id}
                    item={item}
                    showReason
                    showGroupSignal={false}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </SpaceLayout>
  );
}
