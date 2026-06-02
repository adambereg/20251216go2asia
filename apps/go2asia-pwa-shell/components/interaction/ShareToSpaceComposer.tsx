'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { generated } from '@go2asia/sdk';
import { formatRepostTargetLabel } from '@/components/space/runtime/utils';
import { WS2_COPY } from '@/modules/space/ws2Copy';
import { hydratePilotRepostPreview, isPilotRepostTargetType } from '@/components/space/runtime/repostPreview';

type ShareToSpaceComposerProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  targetType: generated.SpaceRepostTargetType;
  targetId: string;
  title: string;
  onClose: () => void;
  onSubmit: (text: string | null) => Promise<void> | void;
};

export function ShareToSpaceComposer({
  isOpen,
  isSubmitting,
  targetType,
  targetId,
  title,
  onClose,
  onSubmit,
}: ShareToSpaceComposerProps) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<generated.SpaceResolvedRepostPreview | null>(null);

  const repostRef = useMemo<generated.SpacePostRepostRef>(
    () => ({
      targetType,
      targetId,
    }),
    [targetId, targetType]
  );

  useEffect(() => {
    if (!isOpen) return;
    setText('');
  }, [isOpen, targetId, targetType]);

  useEffect(() => {
    let cancelled = false;
    if (!isOpen) return;

    setPreview(null);
    if (!isPilotRepostTargetType(targetType)) return;

    void hydratePilotRepostPreview(repostRef).then((value) => {
      if (!cancelled) setPreview(value);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, repostRef, targetType]);

  useEffect(() => {
    if (!isOpen || isSubmitting) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{WS2_COPY.saveForMyself.composerTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Закрыть composer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-3 text-sm text-slate-600">{WS2_COPY.saveForMyself.composerHint}</p>

        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Исходный объект · {formatRepostTargetLabel(targetType)}
          </div>
          {preview?.title ? (
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-3">
              <div className="flex gap-3">
                {preview.imageUrl ? (
                  <div
                    className="h-14 w-20 flex-shrink-0 rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${preview.imageUrl})` }}
                    aria-label={preview.title}
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="line-clamp-2 font-medium text-slate-800">{preview.title}</div>
                  {preview.subtitle ? <div className="mt-1 line-clamp-2 text-slate-600">{preview.subtitle}</div> : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-3 text-slate-600">
              <div className="font-medium text-slate-800">{title}</div>
              <div className="mt-1 text-xs text-slate-500">ID: {targetId}</div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="share-to-space-commentary" className="mb-2 block text-sm font-medium text-slate-700">
            {WS2_COPY.saveForMyself.composerNoteLabel}
          </label>
          <textarea
            id="share-to-space-commentary"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={5000}
            rows={4}
            disabled={isSubmitting}
            placeholder="Что вы думаете об этом материале?"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <div className="mt-1 text-right text-xs text-slate-500">{text.length}/5000</div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => onSubmit(text.trim().length > 0 ? text.trim() : null)}
            disabled={isSubmitting}
            className="rounded-md border border-sky-200 bg-sky-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? WS2_COPY.saveForMyself.actionPending : WS2_COPY.saveForMyself.composerSubmit}
          </button>
        </div>
      </div>
    </div>
  );
}
