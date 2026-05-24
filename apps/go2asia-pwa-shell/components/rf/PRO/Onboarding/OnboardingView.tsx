'use client';

import { Card, CardContent, Button, Badge } from '@go2asia/ui';
import { Plus, Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { mockOnboardingApplications } from '../../mockData';
import { PARTNER_CATEGORY_LABELS } from '../../types';

export function OnboardingView() {
  const [applications] = useState(mockOnboardingApplications);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="info" className="bg-green-100 text-green-700">Отмечено как одобрено (demo)</Badge>;
      case 'rejected':
        return <Badge variant="info" className="bg-red-100 text-red-700">Отклонено</Badge>;
      default:
        return <Badge variant="info" className="bg-amber-100 text-amber-700">Ожидает</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Онбординг бизнесов (demo)</h1>
          <p className="text-slate-600">Demo-поверхность сценария онбординга без записи в backend</p>
        </div>
        <Button variant="secondary" onClick={() => setShowInviteForm(!showInviteForm)}>
          <Plus size={18} className="mr-2" />
          Заполнить demo-приглашение
        </Button>
      </div>

      {/* Форма приглашения */}
      {showInviteForm && (
        <Card className="border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Сценарий приглашения (demo)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email бизнеса
                </label>
                <input
                  type="email"
                  placeholder="example@business.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Название бизнеса
                </label>
                <input
                  type="text"
                  placeholder="Название заведения"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Категория
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Выберите категорию</option>
                  <option value="cafe">Кафе</option>
                  <option value="restaurant">Ресторан</option>
                  <option value="coworking">Коворкинг</option>
                  <option value="market">Магазин</option>
                  <option value="service">Сервис</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1">
                  Сохранить локально (demo)
                </Button>
                <Button variant="secondary" onClick={() => setShowInviteForm(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Заявки */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Заявки на онбординг (demo)</h2>
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{app.businessName}</h3>
                      {getStatusIcon(app.status)}
                      {getStatusBadge(app.status)}
                      <Badge variant="info">{PARTNER_CATEGORY_LABELS[app.category]}</Badge>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>
                        <Mail size={14} className="inline mr-1" />
                        {app.contact.email}
                      </p>
                      {app.contact.phone && (
                        <p>
                          Телефон: {app.contact.phone}
                        </p>
                      )}
                      <p>
                        Контактное лицо: {app.contact.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Подана: {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Отметить как принято (demo)
                      </Button>
                      <Button variant="secondary" size="sm">
                        Отметить как отклонено (demo)
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

