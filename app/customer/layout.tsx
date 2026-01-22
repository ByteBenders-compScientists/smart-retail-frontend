'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, authCheckDone } = useAuthContext();

  useEffect(() => {
    if (!isHydrated || !authCheckDone) return;
    if (!isAuthenticated || !user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
  }, [isHydrated, authCheckDone, isAuthenticated, user, router]);

  if (!authCheckDone || !isHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
