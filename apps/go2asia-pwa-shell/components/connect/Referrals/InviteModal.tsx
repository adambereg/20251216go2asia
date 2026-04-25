'use client';

import { useState, useEffect } from 'react';
import { Button } from '@go2asia/ui';
import { X, Copy, Share2 } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralLink: string;
}

export function InviteModal({ isOpen, onClose, referralLink }: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Присоединяйся к Go2Asia',
        text: 'Присоединяйся к Go2Asia и отслеживай начисления Points.',
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Пригласить друга</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Ссылка для приглашения
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
              />
              <Button variant="secondary" onClick={handleCopy} size="sm">
                <Copy size={16} />
                {copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Поделитесь ссылкой с другом. Когда приглашённый пользователь станет активным, начисление появится в истории Points.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleShare} className="flex-1">
              <Share2 size={16} className="mr-2" />
              Поделиться
            </Button>
            <Button variant="primary" onClick={onClose} className="flex-1">
              Готово
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

