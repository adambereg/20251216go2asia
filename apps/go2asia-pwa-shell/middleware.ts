import { NextResponse } from 'next/server';

/**
 * ВАЖНО (DX):
 * - В локальной разработке разрешаем запуск без Clerk ключей, чтобы можно было смотреть публичные страницы.
 * - В staging/production Clerk должен быть настроен (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), и middleware включается.
 */
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { clerkMiddleware, createRouteMatcher } = isClerkConfigured
  ? require('@clerk/nextjs/server')
  : { clerkMiddleware: null as any, createRouteMatcher: null as any };

/**
 * Определение публичных маршрутов (не требуют аутентификации)
 */
const isPublicRoute = (isClerkConfigured ? createRouteMatcher : (_: any) => (_req: any) => true)([
  '/',
  '/atlas(.*)',
  '/pulse(.*)',
  '/blog(.*)',
  '/guru(.*)',
  '/quest(.*)', // Просмотр квестов публичный, прохождение требует авторизации
  '/rf(.*)', // Каталог партнёров публичный, личные разделы требуют авторизации
  '/rielt(.*)', // Объявления публичные
  '/space(.*)', // Просмотр постов публичный, создание требует авторизации
  '/about(.*)',
  '/help(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

/**
 * Определение маршрутов аутентификации (доступны всем, включая авторизованных)
 */
const isAuthRoute = (isClerkConfigured ? createRouteMatcher : (_: any) => (_req: any) => true)([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

/**
 * Определение защищённых маршрутов (требуют аутентификации)
 * Все маршруты в (authenticated) группе автоматически защищены
 */
const isProtectedRoute = (isClerkConfigured ? createRouteMatcher : (_: any) => (_req: any) => false)([
  '/connect(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/partner(.*)',
  '/rf/merchant(.*)',
  '/rf/pro(.*)',
  '/space/me(.*)',
  '/space/posts(.*)',
  '/space/balance(.*)',
  '/space/referrals(.*)',
  '/space/settings(.*)',
  '/quest/my(.*)',
  '/quest/[id]/run(.*)',
]);

/**
 * Определение админских маршрутов (требуют роль admin)
 */
const isAdminRoute = (isClerkConfigured ? createRouteMatcher : (_: any) => (_req: any) => false)([
  '/admin(.*)',
]);

/**
 * Определение PRO маршрутов (требуют роль pro или admin)
 */
const isPRORoute = (isClerkConfigured ? createRouteMatcher : (_: any) => (_req: any) => false)([
  '/rf/pro(.*)',
  '/quest/pro(.*)',
]);

/**
 * Middleware:
 * - Если Clerk НЕ настроен, пропускаем все запросы (только для local dev / DX).
 * - Если Clerk настроен, используем clerkMiddleware для защиты private routes.
 */
export default isClerkConfigured
  ? clerkMiddleware(async (auth: any, req: any) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  // Маршруты аутентификации доступны всем (публичные)
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }

  // Если маршрут защищённый и пользователь не авторизован - редирект на вход
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Проверка прав доступа для админских маршрутов
  if (isAdminRoute(req)) {
    const role = (sessionClaims as any)?.publicMetadata?.role as string | undefined;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Проверка прав доступа для PRO маршрутов
  if (isPRORoute(req)) {
    const role = (sessionClaims as any)?.publicMetadata?.role as string | undefined;
    if (role !== 'pro' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Публичные маршруты доступны всем
  return NextResponse.next();
})
  : function middleware(_req: Request) {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Пропускаем статические файлы и API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Включаем все маршруты кроме статических файлов
    '/(api|trpc)(.*)',
  ],
};

