
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Item } from '@/lib/types';
import { ItemsTable } from './items-table';
import { ItemFormDialog } from './item-form-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { usePathname } from 'next/navigation';

interface ItemManagementClientProps {
  items: Item[];
  title: string;
  onDeleteItem: (id: string) => void;
  onFormSubmit: (data: Item) => void;
  activeTab: string;
  isReadOnly?: boolean;
}

export function ItemManagementClient({ items, title, onDeleteItem, onFormSubmit, activeTab, isReadOnly = false }: ItemManagementClientProps) {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const pathname = usePathname();

    // The component is read-only if the prop is set or if it's on the public page.
    const readOnly = isReadOnly || pathname === '/dashboard/list-of-equipments';


    const handleAddItem = () => {
        if (readOnly) return;
        setSelectedItem(null);
        setIsFormDialogOpen(true);
    };

    const handleEditItem = (item: Item) => {
        if (readOnly) return;
        setSelectedItem(item);
        setIsFormDialogOpen(true);
    };
    
    const handleDeleteClick = (item: Item) => {
        if (readOnly) return;
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedItem && !readOnly) {
            onDeleteItem(selectedItem.id);
        }
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
    }

    const handleFormSubmitAndClose = (data: Item) => {
        if (readOnly) return;
        onFormSubmit(data);
        setIsFormDialogOpen(false);
    }
    
    const handleReturnItem = (id: string) => console.log("Return item", id);

    const descriptionMap: { [key: string]: string } = {
        'all': 'A complete list of all resources.',
        'available': 'Items ready to be issued.',
        'issued': 'Items currently on loan.',
        'repair': 'Items currently under repair.'
    };

    return (
        <Card>
            <CardHeader className='flex-row items-center justify-between'>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {
                            {
                                "All Items": descriptionMap[activeTab],
                                "Available Items": descriptionMap[activeTab],
                                "Issued & Overdue Items": descriptionMap[activeTab],
                                "Items Under Repair": descriptionMap[activeTab]
                            }[title]
                        }
                    </CardDescription>
                </div>
                {!readOnly && (
                    <Button size="sm" className="gap-1" onClick={handleAddItem}>
                        <PlusCircle className="h-4 w-4" />
                        Add Item
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <ItemsTable 
                    items={items} 
                    onEdit={handleEditItem}
                    onDelete={handleDeleteClick}
                    onReturn={handleReturnItem}
                    isReadOnly={readOnly}
                />
            </CardContent>
            {!readOnly && (
                <>
                    <ItemFormDialog
                        isOpen={isFormDialogOpen}
                        setIsOpen={setIsFormDialogOpen}
                        item={selectedItem}
                        onSubmit={handleFormSubmitAndClose}
                    />
                    {selectedItem && (
                        <DeleteConfirmationDialog
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onConfirm={confirmDelete}
                            itemName={selectedItem.name}
                        />
                    )}
                </>
            )}
        </Card>
    );
}
