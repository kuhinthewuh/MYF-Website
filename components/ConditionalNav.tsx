'use client';

import { usePathname } from 'next/navigation';
import TopNavigationBar from './TopNavigationBar';

export default function ConditionalNav() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin-portal');
  if (isAdminRoute) return null;
  return <TopNavigationBar />;
}
