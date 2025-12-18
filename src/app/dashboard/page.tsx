import { StatsCards } from '@/components/dashboard/stats-cards';
import { SmartStatus } from '@/components/dashboard/smart-status';
import { items } from '@/lib/data';
import type { Item } from '@/lib/types';

export default function DashboardPage() {
  const totalItems = items.length;
  const issuedItems = items.filter((item) => item.status === 'Issued').length;
  const returnedItems = items.filter((item) => item.status === 'Returned').length;
  const availableItems = items.filter((item) => item.status === 'Available').length;
  const overdueItems = items.filter(
    (item: Item) =>
      item.status === 'Issued' &&
      item.expectedReturnDate &&
      new Date(item.expectedReturnDate) < new Date()
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
            returned: returnedItems,
            available: availableItems,
            overdue: overdueItems,
          }}
        />
        <SmartStatus items={items} />
      </div>
    </>
  );
}
