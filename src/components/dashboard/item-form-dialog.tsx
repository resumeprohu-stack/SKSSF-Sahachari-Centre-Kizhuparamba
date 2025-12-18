'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Item, ItemStatus } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL'),
  status: z.enum(['Available', 'Issued', 'Returned']),
  issuedTo: z.string().optional(),
  issueDate: z.date().optional(),
  expectedReturnDate: z.date().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: Item | null;
  onSubmit: (data: any) => void;
}

export function ItemFormDialog({ isOpen, setIsOpen, item, onSubmit }: ItemFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  const [isIssueDateOpen, setIssueDateOpen] = useState(false);
  const [isReturnDateOpen, setReturnDateOpen] = useState(false);

  useEffect(() => {
    if (item) {
      reset({
        ...item,
        issueDate: item.issueDate ? new Date(item.issueDate) : undefined,
        expectedReturnDate: item.expectedReturnDate ? new Date(item.expectedReturnDate) : undefined,
      });
    } else {
      reset({
        name: '',
        category: '',
        description: '',
        imageUrl: '',
        status: 'Available',
        issuedTo: '',
        issueDate: undefined,
        expectedReturnDate: undefined,
      });
    }
  }, [item, reset, isOpen]);

  const handleFormSubmit = (data: ItemFormData) => {
    onSubmit({
        ...data,
        id: item?.id || new Date().toISOString(),
        issueDate: data.issueDate?.toISOString(),
        expectedReturnDate: data.expectedReturnDate?.toISOString(),
        dateAdded: item?.dateAdded || new Date().toISOString(),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details of this item.' : 'Fill in the details for the new item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Input id="category" {...register('category')} />
              {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <div className="col-span-3">
              <Input id="imageUrl" {...register('imageUrl')} placeholder="https://picsum.photos/seed/..." />
              {errors.imageUrl && <p className="text-destructive text-xs mt-1">{errors.imageUrl.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" {...register('description')} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(['Available', 'Issued', 'Returned'] as ItemStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issuedTo" className="text-right">Issued To</Label>
            <Input id="issuedTo" {...register('issuedTo')} className="col-span-3" placeholder="Name (Contact)" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issueDate" className="text-right">Issue Date</Label>
             <Controller
              name="issueDate"
              control={control}
              render={({ field }) => (
                <Popover open={isIssueDateOpen} onOpenChange={setIssueDateOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full col-span-3 justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            field.onChange(date);
                            setIssueDateOpen(false);
                        }}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expectedReturnDate" className="text-right">Expected Return</Label>
             <Controller
              name="expectedReturnDate"
              control={control}
              render={({ field }) => (
                <Popover open={isReturnDateOpen} onOpenChange={setReturnDateOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full col-span-3 justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            field.onChange(date);
                            setReturnDateOpen(false);
                        }}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>{item ? 'Save Changes' : 'Create Item'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
