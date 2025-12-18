import { ItemCard } from '@/components/item-card';
import { items as allItems } from '@/lib/data';
import type { Item } from '@/lib/types';

export default function AvailableItemsPage() {
  const availableItems: Item[] = allItems.filter(
    (item) => item.status === 'Available'
  );

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
          Available Items
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse the resources currently available for loan from the Sahachari Center.
        </p>
      </div>

      {availableItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No items are available at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
