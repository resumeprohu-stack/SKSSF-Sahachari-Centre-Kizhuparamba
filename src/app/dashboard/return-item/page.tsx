'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { items } from '@/lib/data';
import type { Item } from '@/lib/types';
import { ReturnItemDialog } from '@/components/dashboard/return-item-dialog';

export default function ReturnItemPage() {
  const { toast } = useToast();
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [itemToReturn, setItemToReturn] = useState<Item | null>(null);

  const issuedItems = items.filter((item) => item.status === 'Issued');

  const handleOpenReturnDialog = (item: Item) => {
    setItemToReturn(item);
    setIsReturnDialogOpen(true);
  };

  const handleReturnSubmit = (data: { collectedBy: string, returnDate: Date }) => {
    console.log('Item Returned:', { itemId: itemToReturn?.id, ...data });
    toast({
      title: 'Item Marked as Returned!',
      description: `${itemToReturn?.name} collected by ${data.collectedBy}.`,
    });
    // In a real app, you would update the item's status to 'Available' or 'Returned'
    setIsReturnDialogOpen(false);
    setItemToReturn(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Undo2 className="h-6 w-6" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Return an Item
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Select an Item to Return</CardTitle>
          <CardDescription>
            Choose an issued item from the list below to mark it as returned.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issuedItems.length > 0 ? (
              issuedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Issued to: {item.issuedTo}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReturnDialog(item)}
                  >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Return
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No items are currently issued.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {itemToReturn && (
        <ReturnItemDialog
          isOpen={isReturnDialogOpen}
          setIsOpen={setIsReturnDialogOpen}
          item={itemToReturn}
          onSubmit={handleReturnSubmit}
        />
      )}
    </div>
  );
}
