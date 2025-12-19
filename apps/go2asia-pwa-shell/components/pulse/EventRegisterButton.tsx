'use client';

import { useState } from 'react';
import { Button } from '@go2asia/ui';
import { useRegisterEvent } from '@go2asia/sdk/pulse';
import { CheckCircle2, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface EventRegisterButtonProps {
  eventId: string;
  eventTitle?: string;
  isRegistered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Error object structure from API
 */
interface ApiError {
  error?: {
    code?: string;
    message?: string;
  };
  status?: number;
  requestId?: string;
}

/**
 * Handle API errors and show appropriate messages
 */
function handleRegisterError(error: unknown, router: ReturnType<typeof useRouter>) {
  const apiError = error as ApiError;
  const status = apiError.status || 0;
  const message = apiError.error?.message || 'Произошла ошибка при регистрации';

  // Network error
  if (status === 0 || !status) {
    toast.error('Проверьте подключение к интернету');
    return;
  }

  // 401 Unauthorized - redirect to sign-in
  if (status === 401) {
    const currentPath = window.location.pathname;
    router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
    return;
  }

  // 403 Forbidden
  if (status === 403) {
    toast.error('У вас нет доступа к этому ресурсу');
    return;
  }

  // 409 Conflict - already registered
  if (status === 409) {
    toast.error('Вы уже зарегистрированы на это событие');
    return;
  }

  // 5xx Server Error
  if (status >= 500) {
    toast.error('Произошла ошибка сервера. Попробуйте позже');
    return;
  }

  // Other errors
  toast.error(message);
}

export function EventRegisterButton({
  eventId,
  eventTitle = 'событие',
  isRegistered: initialIsRegistered = false,
  size = 'lg',
  className,
}: EventRegisterButtonProps) {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const { mutate: register, isPending } = useRegisterEvent();

  const handleRegister = () => {
    register(
      { eventId },
      {
        onSuccess: () => {
          setIsRegistered(true);
          toast.success(`Вы успешно зарегистрированы на событие "${eventTitle}"!`);
        },
        onError: (error) => {
          handleRegisterError(error, router);
        },
      }
    );
  };

  return (
    <Button
      onClick={handleRegister}
      disabled={isPending || isRegistered}
      variant={isRegistered ? 'secondary' : 'primary'}
      size={size}
      className={className || 'w-full sm:w-auto flex items-center justify-center gap-2'}
    >
      {isPending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Регистрация...
        </>
      ) : isRegistered ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          Вы зарегистрированы
        </>
      ) : (
        <>
          <Calendar className="w-5 h-5" />
          Зарегистрироваться
        </>
      )}
    </Button>
  );
}
