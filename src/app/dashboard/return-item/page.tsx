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
import { Undo2, Phone, MessageCircle } from 'lucide-react';
import { items } from '@/lib/data';
import type { Item } from '@/lib/types';
import { ReturnItemDialog } from '@/components/dashboard/return-item-dialog';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export default function ReturnItemPage() {
  const { toast } = useToast();
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [itemToReturn, setItemToReturn] = useState<Item | null>(null);

  const issuedItems = items
    .filter((item) => item.status === 'Issued')
    .sort((a, b) => {
        if (!a.issueDate || !b.issueDate) return 0;
        return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
    });

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
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Issued Items</CardTitle>
          <CardDescription>
            A list of all items currently on loan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issuedItems.length > 0 ? (
              issuedItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Item Info */}
                    <div className="md:col-span-2 space-y-3">
                      <h3 className="font-bold text-lg text-primary">{item.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p><strong className="text-muted-foreground">Recipient:</strong> {item.recipientName}</p>
                        <p><strong className="text-muted-foreground">Issuer:</strong> {item.issuerName}</p>
                        <p><strong className="text-muted-foreground">Issue Date:</strong> {item.issueDate ? format(parseISO(item.issueDate), 'PPP') : 'N/A'}</p>
                        <p><strong className="text-muted-foreground">Return By:</strong> {item.expectedReturnDate ? format(parseISO(item.expectedReturnDate), 'PPP') : 'N/A'}</p>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col items-start md:items-end justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`tel:${item.recipientMobile}`}>
                                    <Phone className="h-4 w-4" />
                                    <span className="sr-only">Call recipient</span>
                                </Link>
                            </Button>
                             <Button variant="outline" size="icon" className="bg-green-500 hover:bg-green-600 text-white" asChild>
                                <Link href={`https://wa.me/${item.recipientMobile}`} target="_blank">
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="sr-only">WhatsApp recipient</span>
                                </Link>
                            </Button>
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
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
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
