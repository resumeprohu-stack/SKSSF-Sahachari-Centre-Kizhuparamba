import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { items } from '@/lib/data';
import { ItemManagementClient } from '@/components/dashboard/item-management-client';

export default function ItemManagementPage() {
  const allItems = items;
  const availableItems = items.filter((item) => item.status === 'Available');
  const issuedItems = items.filter((item) => item.status === 'Issued');
  const returnedItems = items.filter((item) => item.status === 'Returned');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Item Management
        </h1>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:w-auto">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="issued">Issued</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
            <ItemManagementClient items={allItems} title="All Items" />
        </TabsContent>
        <TabsContent value="available">
            <ItemManagementClient items={availableItems} title="Available Items"/>
        </TabsContent>
        <TabsContent value="issued">
            <ItemManagementClient items={issuedItems} title="Issued & Overdue Items"/>
        </TabsContent>
        <TabsContent value="returned">
            <ItemManagementClient items={returnedItems} title="Returned Items"/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
