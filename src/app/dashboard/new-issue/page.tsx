'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useItems } from '@/hooks/use-items';
import { Item } from '@/lib/types';

const issueSchema = z.object({
  itemId: z.string({ required_error: 'Please select an item to issue' }),
  recipientName: z.string().min(3, 'Recipient name is required'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit mobile number'),
  issuerName: z.string().min(3, 'Issuer name is required'),
  issueDate: z.date({ required_error: 'Issue date is required' }),
  expectedReturnDate: z.date({ required_error: 'Expected return date is required' }),
}).refine(data => data.expectedReturnDate > data.issueDate, {
  message: 'Return date must be after the issue date',
  path: ['expectedReturnDate'],
});

type IssueFormData = z.infer<typeof issueSchema>;

export default function NewIssuePage() {
  const { items, setItems, isLoading } = useItems();
  const { toast } = useToast();
  const [isIssueCalendarOpen, setIssueCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setReturnCalendarOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const availableItems = items.filter((item) => item.status === 'Available');

  const onSubmit = (data: IssueFormData) => {
    const itemToUpdate = items.find(item => item.id === data.itemId);
    if (!itemToUpdate) {
        toast({
            variant: 'destructive',
            title: 'Error issuing item',
            description: 'The selected item could not be found.',
        });
        return;
    }

    const updatedItem: Item = {
        ...itemToUpdate,
        status: 'Issued',
        recipientName: data.recipientName,
        recipientMobile: data.mobileNumber,
        issuerName: data.issuerName,
        issueDate: data.issueDate.toISOString(),
        expectedReturnDate: data.expectedReturnDate.toISOString(),
        actualReturnDate: undefined,
    };
    
    const updatedItems = items.map(item => item.id === data.itemId ? updatedItem : item);
    setItems(updatedItems);
    
    toast({
      title: "Item Issued Successfully!",
      description: `${itemToUpdate.name} issued to ${data.recipientName} on ${format(data.issueDate, 'PPP')}.`,
    });

    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <FilePlus className="h-6 w-6" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          New Item Issue
        </h1>
      </div>
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Issue an Item</CardTitle>
          <CardDescription>
            Fill out the form to record a new item being issued to a recipient.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="itemId">Item to Issue</Label>
              <Controller
                name="itemId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an available item" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableItems.length > 0 ? (
                        availableItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - {item.category}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No items available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.itemId && (
                <p className="text-sm text-destructive">{errors.itemId.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input id="recipientName" {...register('recipientName')} />
              {errors.recipientName && (
                <p className="text-sm text-destructive">{errors.recipientName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" type="tel" {...register('mobileNumber')} />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="issuerName">Issuer Name</Label>
              <Input id="issuerName" {...register('issuerName')} />
              {errors.issuerName && (
                <p className="text-sm text-destructive">{errors.issuerName.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issueDate">Date of Issue</Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <Popover open={isIssueCalendarOpen} onOpenChange={setIssueCalendarOpen}>
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
                          if (date) field.onChange(date);
                          setIssueCalendarOpen(false);
                        }}
                        defaultMonth={field.value}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.issueDate && (
                <p className="text-sm text-destructive">{errors.issueDate.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
              <Controller
                name="expectedReturnDate"
                control={control}
                render={({ field }) => (
                  <Popover open={isReturnCalendarOpen} onOpenChange={setReturnCalendarOpen}>
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
                          if (date) field.onChange(date);
                          setReturnCalendarOpen(false);
                        }}
                        defaultMonth={field.value}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.expectedReturnDate && (
                <p className="text-sm text-destructive">{errors.expectedReturnDate.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
