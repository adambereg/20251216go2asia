import type { Metadata } from 'next';
import { ThemesClient } from './ThemesClient';

export const metadata: Metadata = {
  title: 'Темы Atlas Asia',
  description:
    'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
  openGraph: {
    title: 'Темы Atlas Asia',
    description: 'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
    type: 'website',
  },
};

export default function ThemesIndexPage() {
  return <ThemesClient />;
}


