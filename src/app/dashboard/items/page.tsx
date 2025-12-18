
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemManagementClient } from '@/components/dashboard/item-management-client';
import type { Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useItems } from '@/hooks/use-items';

export default function ItemManagementPage() {
  const { items, isLoading, handleAddItem, handleEditItem, handleDeleteItem } = useItems();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  if (isLoading) {
    return <div>Loading...</div>
  }

  const availableItems = items.filter((item) => item.status === 'Available');
  const issuedItems = items.filter((item) => item.status === 'Issued');
  const repairItems = items.filter((item) => item.status === 'Repair');

  const onFormSubmit = (data: any) => {
    if (data.id) {
      handleEditItem(data);
      toast({
        title: 'Item Updated',
        description: `${data.itemName} has been successfully updated.`,
      });
    } else {
      handleAddItem(data);
      toast({
        title: 'Item Added',
        description: `${data.itemName} has been successfully added.`,
      });
    }
  };

  const onDeleteConfirm = (itemId: string) => {
    handleDeleteItem(itemId);
    toast({
      title: 'Item Deleted',
      description: 'The item has been successfully removed.',
    });
  };


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
            onDeleteItem={onDeleteConfirm}
            onFormSubmit={onFormSubmit}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="available">
          <ItemManagementClient 
            items={availableItems} 
            title="Available Items" 
            onDeleteItem={onDeleteConfirm}
            onFormSubmit={onFormSubmit}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="issued">
          <ItemManagementClient 
            items={issuedItems} 
            title="Issued & Overdue Items" 
            onDeleteItem={onDeleteConfirm}
            onFormSubmit={onFormSubmit}
            activeTab={activeTab}
          />
        </TabsContent>
        <TabsContent value="repair">
            <ItemManagementClient
                items={repairItems}
                title="Items Under Repair"
                onDeleteItem={onDeleteConfirm}
                onFormSubmit={onFormSubmit}
                activeTab={activeTab}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
