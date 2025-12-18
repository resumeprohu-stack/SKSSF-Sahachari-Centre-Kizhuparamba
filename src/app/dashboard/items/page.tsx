
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { items as initialItems } from '@/lib/data';
import { ItemManagementClient } from '@/components/dashboard/item-management-client';
import type { Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ItemManagementPage() {
  const [allItems, setAllItems] = useState<Item[]>(initialItems);
  const { toast } = useToast();

  const availableItems = allItems.filter((item) => item.status === 'Available');
  const issuedItems = allItems.filter((item) => item.status === 'Issued');

  const handleDeleteItem = (itemId: string) => {
    // In a real app, this would be an API call.
    // For now, we filter the item out of the local state.
    setAllItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast({
      title: 'Item Deleted',
      description: 'The item has been successfully removed.',
    });
  };

  const handleAddItem = (item: Item) => {
    // In a real app, this would be an API call.
    // For now, we add the item to the local state.
    setAllItems((prevItems) => [item, ...prevItems]);
    toast({
      title: 'Item Added',
      description: `${item.name} has been successfully added.`,
    });
  }

  const handleEditItem = (item: Item) => {
    // In a real app, this would be an API call.
    // For now, we update the item in the local state.
    setAllItems((prevItems) => prevItems.map(i => i.id === item.id ? item : i));
    toast({
      title: 'Item Updated',
      description: `${item.name} has been successfully updated.`,
    });
  }

  const handleFormSubmit = (data: Item) => {
    if (allItems.find(i => i.id === data.id)) {
      handleEditItem(data);
    } else {
      handleAddItem(data);
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Item Management
        </h1>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="issued">Issued</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ItemManagementClient 
            items={allItems} 
            title="All Items" 
            onDeleteItem={handleDeleteItem}
            onFormSubmit={handleFormSubmit}
          />
        </TabsContent>
        <TabsContent value="available">
          <ItemManagementClient 
            items={availableItems} 
            title="Available Items" 
            onDeleteItem={handleDeleteItem}
            onFormSubmit={handleFormSubmit}
          />
        </TabsContent>
        <TabsContent value="issued">
          <ItemManagementClient 
            items={issuedItems} 
            title="Issued & Overdue Items" 
            onDeleteItem={handleDeleteItem}
            onFormSubmit={handleFormSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
