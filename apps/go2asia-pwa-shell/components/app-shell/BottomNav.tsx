'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Globe, Calendar, BookOpen, Users } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Определяем активный модуль на основе pathname
  const getActiveModule = (): 'home' | 'atlas' | 'pulse' | 'blog' | 'space' => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/atlas')) return 'atlas';
    if (pathname.startsWith('/pulse')) return 'pulse';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname.startsWith('/space')) return 'space';
    return 'home';
  };

  const handleModuleChange = (module: 'home' | 'atlas' | 'pulse' | 'blog' | 'space') => {
    const routes: Record<string, string> = {
      home: '/',
      atlas: '/atlas',
      pulse: '/pulse',
      blog: '/blog',
      space: '/space',
    };
    router.push(routes[module] || '/');
  };

  const active = getActiveModule();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200"
      aria-label="Нижняя навигация"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-around h-16">
          {(
            [
              { key: 'home', label: 'Home', icon: Home },
              { key: 'atlas', label: 'Atlas', icon: Globe },
              { key: 'pulse', label: 'Pulse', icon: Calendar },
              { key: 'blog', label: 'Blog', icon: BookOpen },
              { key: 'space', label: 'Space', icon: Users },
            ] as const
          ).map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => handleModuleChange(key)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
