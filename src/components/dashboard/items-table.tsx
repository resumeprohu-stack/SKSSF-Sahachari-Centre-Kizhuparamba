'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Undo2 } from 'lucide-react';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { usePathname } from 'next/navigation';

interface ItemsTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onReturn: (id: string) => void;
}

export function ItemsTable({ items, onEdit, onDelete, onReturn }: ItemsTableProps) {
  const pathname = usePathname();
  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Issued To</TableHead>
          <TableHead className="hidden md:table-cell">Expected Return</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="hidden sm:table-cell">
              <Image
                alt={item.name}
                className="aspect-square rounded-md object-cover"
                height="64"
                src={item.imageUrl}
                width="64"
                data-ai-hint={item.category}
              />
            </TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                    item.status === 'Available' && 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
                    item.status === 'Issued' && 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
                    isOverdue(item.expectedReturnDate) && item.status === 'Issued' && 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
                    "capitalize"
                  )}
              >
                {item.status === 'Issued' && isOverdue(item.expectedReturnDate) ? 'Overdue' : item.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{item.issuedTo || 'N/A'}</TableCell>
            <TableCell className="hidden md:table-cell">
              {item.expectedReturnDate ? format(parseISO(item.expectedReturnDate), 'PPP') : 'N/A'}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => onEdit(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {item.status === 'Issued' && pathname === '/dashboard/return-item' && (
                    <DropdownMenuItem onSelect={() => onReturn(item.id)}>
                      <Undo2 className="mr-2 h-4 w-4" />
                      Mark as Returned
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
