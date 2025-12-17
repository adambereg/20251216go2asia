import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContent } from './AppContent';

export const metadata: Metadata = {
  title: {
    default: 'Go2Asia - Экосистема путешествий в Юго-Восточной Азии',
    template: '%s | Go2Asia',
  },
  description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
  keywords: ['путешествия', 'Юго-Восточная Азия', 'Таиланд', 'Вьетнам', 'Индонезия'],
  authors: [{ name: 'Go2Asia Team' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://go2asia.space',
    siteName: 'Go2Asia',
    title: 'Go2Asia - Экосистема путешествий в Юго-Восточной Азии',
    description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go2Asia - Экосистема путешествий',
    description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#1677FF',
};

// Проверяем, настроен ли Clerk (есть ли publishableKey)
// В Next.js NEXT_PUBLIC_* переменные доступны и на сервере, и на клиенте
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Если Clerk настроен, используем его, иначе только AuthModeProvider
  if (isClerkConfigured) {
    return (
      <html lang="ru">
        <body>
          <ClerkProvider>
            <AppContent>{children}</AppContent>
          </ClerkProvider>
        </body>
      </html>
    );
  }

  // В development режиме без Clerk используем только AuthModeProvider
  return (
    <html lang="ru">
      <body>
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}
