
'use client';

import { ItemsTable } from '@/components/dashboard/items-table';
import { useItems } from '@/hooks/use-items';
import type { Item } from '@/lib/types';
import { List } from 'lucide-react';

export default function AvailableItemsPage() {
  const { items, isLoading } = useItems();

  if (isLoading) {
    return (
        <div className="container py-12 text-center">
            <p>Loading items...</p>
        </div>
    );
  }
  
  const availableItems: Item[] = items.filter(
    (item) => item.status === 'Available'
  );

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <List className="h-6 w-6" />
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Item Availability
            </h1>
        </div>
      

      {availableItems.length > 0 ? (
        <div className="border rounded-lg">
           <ItemsTable items={availableItems} onEdit={() => {}} onDelete={() => {}} onReturn={() => {}} />
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-xl text-muted-foreground">
            No items are available at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
