
'use client';

import { ItemsTable } from '@/components/dashboard/items-table';
import { useItems } from '@/hooks/use-items';
import type { Item } from '@/lib/types';

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
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
          Item Availability
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse the resources currently available for loan from the Sahachari Center.
        </p>
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
