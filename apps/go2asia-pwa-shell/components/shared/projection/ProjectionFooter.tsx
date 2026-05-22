import type { ReactNode } from 'react';

interface ProjectionFooterProps {
  children: ReactNode;
  className?: string;
}

export function ProjectionFooter({ children, className = '' }: ProjectionFooterProps) {
  return <p className={`text-xs text-slate-500 ${className}`}>{children}</p>;
}
