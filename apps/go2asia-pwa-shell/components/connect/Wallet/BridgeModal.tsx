'use client';

import { Info, X } from 'lucide-react';

/**
 * @deprecated Future-only legacy external token UI.
 * Stage 6.5.5 keeps this as an inert notice only. No amount input, fees,
 * blockchain gateway, or address copy should be reintroduced here.
 */
interface BridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'topup' | 'withdraw';
  currentBalance: number;
}

export function BridgeModal({ isOpen, onClose }: BridgeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            G2A future layer
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Контент */}
        <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-slate-600 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p>
                This legacy external token surface is disabled. G2A token operations are future-only and are not
                current runtime behavior.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Legacy props are ignored and remain only for backwards-compatible imports during cleanup.
        </p>
        </div>
      </div>
    </div>
  );
}
