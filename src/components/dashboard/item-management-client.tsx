'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Item } from '@/lib/types';
import { ItemsTable } from './items-table';
import { ItemFormDialog } from './item-form-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface ItemManagementClientProps {
    items: Item[];
    title: string;
}

export function ItemManagementClient({ items, title }: ItemManagementClientProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const handleAddItem = () => {
        setSelectedItem(null);
        setIsDialogOpen(true);
    };

    const handleEditItem = (item: Item) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };
    
    // In a real app, these actions would update the database
    const handleFormSubmit = (data: Item) => {
        console.log("Form submitted", data);
        setIsDialogOpen(false);
    }
    const handleDeleteItem = (id: string) => console.log("Delete item", id);
    const handleReturnItem = (id: string) => console.log("Return item", id);

    return (
        <Card>
            <CardHeader className='flex-row items-center justify-between'>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {
                            {
                                "All Items": "A complete list of all resources.",
                                "Available Items": "Items ready to be issued.",
                                "Issued & Overdue Items": "Items currently on loan.",
                            }[title]
                        }
                    </CardDescription>
                </div>
                <Button size="sm" className="gap-1" onClick={handleAddItem}>
                    <PlusCircle className="h-4 w-4" />
                    Add Item
                </Button>
            </CardHeader>
            <CardContent>
                <ItemsTable 
                    items={items} 
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onReturn={handleReturnItem}
                />
            </CardContent>
            <ItemFormDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                item={selectedItem}
                onSubmit={handleFormSubmit}
            />
        </Card>
    );
}
