import type { Metadata } from 'next';
import { ThemePageClient } from './themePageClient';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Тема: ${slug} — Atlas Asia`,
    description: 'Тематический справочник Atlas Asia на базе Guide Engine v1.',
    alternates: { canonical: `/atlas/themes/${encodeURIComponent(slug)}` },
  };
}

export default function ThemePage() {
  return <ThemePageClient />;
}

