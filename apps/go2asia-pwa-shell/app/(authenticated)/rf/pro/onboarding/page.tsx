import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Онбординг (soon) | PRO Dashboard | Russian Friendly',
  description: 'Статусный маршрут онбординга PRO без runtime-операций в текущем этапе',
};

export default function PROOnboardingPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Онбординг бизнесов PRO (soon)
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Маршрут зарезервирован для будущего этапа. Сейчас он работает как статусная поверхность
        и не выполняет операционные действия в runtime.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a href="/rf/pro#pw-linked-partners" className="font-medium text-blue-700 hover:text-blue-800">
          Открыть live связи PRO
        </a>
        <a href="/rf/pro" className="font-medium text-blue-700 hover:text-blue-800">
          Вернуться в PRO workspace
        </a>
      </div>
    </main>
  );
}
