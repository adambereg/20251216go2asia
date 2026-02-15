import {
  Info,
  GitCompare,
  MapPin,
  Route,
  Map,
  ShieldCheck,
  Calendar,
  Building2,
  Users,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

export type GuideTabKey =
  | 'overview'
  | 'compare'
  | 'locations'
  | 'route'
  | 'map'
  | 'practice'
  | 'events'
  | 'places'
  | 'audience'
  | 'faq'
  | 'experience';

export const GUIDE_TAB_META: Record<
  GuideTabKey,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  overview: { label: 'Обзор', icon: Info },
  compare: { label: 'Контекст и сравнение', icon: GitCompare },
  locations: { label: 'Локации', icon: MapPin },
  route: { label: 'Маршрут / План', icon: Route },
  map: { label: 'Карта', icon: Map },
  practice: { label: 'Практика', icon: ShieldCheck },
  events: { label: 'События', icon: Calendar },
  places: { label: 'Места', icon: Building2 },
  audience: { label: 'Для кого', icon: Users },
  faq: { label: 'FAQ', icon: HelpCircle },
  experience: { label: 'Опыт', icon: MessageCircle },
};

