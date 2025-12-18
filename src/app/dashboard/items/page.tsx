
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemManagementClient } from '@/components/dashboard/item-management-client';
import type { Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useItems } from '@/hooks/use-items';

export default function ItemManagementPage() {
  const { items, setItems, isLoading } = useItems();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  if (isLoading) {
    return <div>Loading...</div>
  }

  const availableItems = items.filter((item) => item.status === 'Available');
  const issuedItems = items.filter((item) => item.status === 'Issued');
  const repairItems = items.filter((item) => item.status === 'Repair');

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    toast({
      title: 'Item Deleted',
      description: 'The item has been successfully removed.',
    });
  };

  const handleAddItem = (item: Omit<Item, 'id' | 'dateAdded'>) => {
    const newItem: Item = {
      ...item,
      id: new Date().toISOString(),
      dateAdded: new Date().toISOString(),
    };
    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    toast({
      title: 'Item Added',
      description: `${item.name} has been successfully added.`,
    });
  }

  const handleEditItem = (item: Item) => {
    const updatedItems = items.map(i => i.id === item.id ? item : i);
    setItems(updatedItems);
    toast({
      title: 'Item Updated',
      description: `${item.name} has been successfully updated.`,
    });
  }

  const handleFormSubmit = (data: any) => {
    if (items.find(i => i.id === data.id)) {
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
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="issued">Issued</TabsTrigger>
          <TabsTrigger value="repair">Under Repair</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ItemManagementClient 
            items={items} 
            title="All Items" 
            onDeleteItem={handleDeleteItem}
            onFormSubmit={handleFormSubmit}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="available">
          <ItemManagementClient 
            items={availableItems} 
            title="Available Items" 
            onDeleteItem={handleDeleteItem}
            onFormSubmit={handleFormSubmit}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="issued">
          <ItemManagementClient 
            items={issuedItems} 
            title="Issued & Overdue Items" 
            onDeleteItem={handleDeleteItem}
            onFormSubmit={handleFormSubmit}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="repair">
            <ItemManagementClient
                items={repairItems}
                title="Items Under Repair"
                onDeleteItem={handleDeleteItem}
                onFormSubmit={handleFormSubmit}
                activeTab={activeTab}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
