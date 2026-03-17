'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin-portal');
  if (isAdminRoute) return null;
  return <>{children}</>;
}
