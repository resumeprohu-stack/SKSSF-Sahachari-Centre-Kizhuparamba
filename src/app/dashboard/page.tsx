
'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { SmartStatus } from '@/components/dashboard/smart-status';
import type { Item } from '@/lib/types';
import { useItems } from '@/hooks/use-items';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { items, isLoading } = useItems();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // or a login prompt
  }
  
  const totalItems = items.length;
  const issuedItems = items.filter((item) => item.status === 'Issued').length;
  const availableItems = items.filter((item) => item.status === 'Available').length;
  const overdueItems = items.filter(
    (item: Item) =>
      item.status === 'Issued' &&
      item.expectedReturnDate &&
      new Date(item.expectedReturnDate) < new Date() &&
      !item.actualReturnDate
  ).length;


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Dashboard Overview
        </h1>
      </div>
      <div className="flex flex-col gap-6">
        <StatsCards
          stats={{
            total: totalItems,
            issued: issuedItems,
            available: availableItems,
            overdue: overdueItems,
          }}
        />
        <SmartStatus items={items} />
      </div>
    </>
  );
}
