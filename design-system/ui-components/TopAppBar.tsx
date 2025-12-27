import React, { useEffect, useRef, useState } from 'react';
import { Globe, Search, Grid3x3 } from 'lucide-react';
import { Avatar } from './Avatar';

export interface TopAppBarProps {
  onMenuClick: () => void;
  onHomeClick: () => void;
  onSearchClick?: () => void;
  user?: {
    initials: string;
    name: string;
    email: string;
  };
  onAuthClick?: () => void;
  onProfileClick?: () => void;
  onSignOutClick?: () => void;
  className?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onMenuClick,
  onHomeClick,
  onSearchClick,
  user,
  onAuthClick,
  onProfileClick,
  onSignOutClick,
  className = '',
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const onDocumentMouseDown = (event: MouseEvent) => {
      const targetNode = event.target as Node | null;
      if (targetNode && userMenuRef.current && !userMenuRef.current.contains(targetNode)) {
        setIsUserMenuOpen(false);
      }
    };

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('keydown', onDocumentKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <button
            onClick={onHomeClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Globe className="w-8 h-8 text-sky-600" />
            <span className="text-xl font-bold text-slate-900">Go2Asia</span>
          </button>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Главная навигация">
            <button className="text-slate-600 hover:text-sky-600 transition-colors font-medium">
              Atlas
            </button>
            <button className="text-slate-600 hover:text-sky-600 transition-colors font-medium">
              Pulse
            </button>
            <button className="text-slate-600 hover:text-sky-600 transition-colors font-medium">
              Blog
            </button>
            <button className="text-slate-600 hover:text-sky-600 transition-colors font-medium">
              Space
            </button>
          </nav>

          {/* Действия */}
          <div className="flex items-center gap-3">
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-all"
                aria-label="Поиск"
              >
                <Search size={20} />
              </button>
            )}
            <button
              onClick={onMenuClick}
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-all"
              aria-label="Все модули"
            >
              <Grid3x3 size={20} />
            </button>
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    if (!onSignOutClick) {
                      onProfileClick?.();
                      return;
                    }
                    setIsUserMenuOpen((prev) => !prev);
                  }}
                  aria-haspopup={onSignOutClick ? 'menu' : undefined}
                  aria-expanded={onSignOutClick ? isUserMenuOpen : undefined}
                  aria-label="Меню пользователя"
                >
                  <Avatar size="sm" initials={user.initials} />
                </button>

                {onSignOutClick && isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-sm font-medium text-slate-900 truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    </div>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onProfileClick?.();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Личный кабинет
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOutClick();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-50"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
