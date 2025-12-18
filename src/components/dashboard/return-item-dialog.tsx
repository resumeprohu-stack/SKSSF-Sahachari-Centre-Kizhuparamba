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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Item } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const returnSchema = z.object({
  collectedBy: z.string().min(3, 'Collector name is required'),
  returnDate: z.date({ required_error: 'Return date is required' }),
});

type ReturnFormData = z.infer<typeof returnSchema>;

interface ReturnItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: Item;
  onSubmit: (data: ReturnFormData) => void;
}

export function ReturnItemDialog({ isOpen, setIsOpen, item, onSubmit }: ReturnItemDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      returnDate: new Date(),
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset({
        collectedBy: '',
        returnDate: new Date(),
      });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Return Item</DialogTitle>
          <DialogDescription>
            Confirm the return of <strong>{item.name}</strong>. This will make the item available again.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="collectedBy">Collected By</Label>
            <Input id="collectedBy" {...register('collectedBy')} />
            {errors.collectedBy && <p className="text-destructive text-sm mt-1">{errors.collectedBy.message}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="returnDate">Date of Collection</Label>
            <Controller
              name="returnDate"
              control={control}
              render={({ field }) => (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                      defaultMonth={field.value}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.returnDate && <p className="text-destructive text-sm mt-1">{errors.returnDate.message}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Confirm Return'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
