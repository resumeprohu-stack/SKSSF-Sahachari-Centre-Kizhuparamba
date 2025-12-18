
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
import { CalendarIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useItems } from '@/hooks/use-items';

const itemSchema = (existingItemCodes: string[] = [], currentItemCode?: string) => z.object({
  id: z.string().optional(),
  itemName: z.string().min(3, 'Name must be at least 3 characters'),
  itemCode: z.string().length(6, 'Item code must be 6 characters')
    .refine(code => /^[a-zA-Z0-9]{6}$/.test(code), 'Item code must be alphanumeric')
    .refine(code => !existingItemCodes.filter(c => c !== currentItemCode).includes(code), 'Item code must be unique'),
  imageUrl: z.string().url('Must be a valid URL or data URI'),
  description: z.string().optional(),
  status: z.enum(['Available', 'Issued', 'Repair']),
  dateAdded: z.date({ required_error: 'Date of entry is required' }),
  category: z.string().min(1, 'Category is required'),
});


interface ItemFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: Item | null;
  onSubmit: (data: any) => void;
}

export function ItemFormDialog({ isOpen, setIsOpen, item, onSubmit }: ItemFormDialogProps) {
  const { items } = useItems();
  const existingItemCodes = items.map(i => i.itemCode);

  const currentSchema = itemSchema(existingItemCodes, item?.itemCode);
  type ItemFormData = z.infer<typeof currentSchema>;
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ItemFormData>({
    resolver: zodResolver(currentSchema),
  });
  
  const [isDateAddedOpen, setDateAddedOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        reset({
          ...item,
          dateAdded: item.dateAdded ? new Date(item.dateAdded) : new Date(),
        });
        setImagePreview(item.imageUrl);
      } else {
        reset({
          itemName: '',
          itemCode: '',
          description: '',
          imageUrl: '',
          status: 'Available',
          dateAdded: new Date(),
          category: '',
        });
        setImagePreview(null);
      }
    }
  }, [item, reset, isOpen]);

  const handleFormSubmit = (data: ItemFormData) => {
    const submissionData = {
        ...data,
        dateAdded: data.dateAdded.toISOString(),
    };
    if (item?.id) {
        (submissionData as any).id = item.id;
    } else {
        delete (submissionData as any).id;
    }
    onSubmit(submissionData);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('imageUrl', result, { shouldValidate: true });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details of this item.' : 'Fill in the details for the new item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemName" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input id="itemName" {...register('itemName')} />
              {errors.itemName && <p className="text-destructive text-xs mt-1">{errors.itemName.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemCode" className="text-right">Item Code</Label>
            <div className="col-span-3">
              <Input id="itemCode" {...register('itemCode')} />
              {errors.itemCode && <p className="text-destructive text-xs mt-1">{errors.itemCode.message}</p>}
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
            <Label htmlFor="image" className="text-right">Image</Label>
            <div className='col-span-3'>
              <Button asChild variant="outline" className='w-full'>
                <label htmlFor="image-upload" className='cursor-pointer'>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                  <input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                </label>
              </Button>
               {/* Hidden input to store URL for form submission */}
              <Input {...register('imageUrl')} type="hidden" />
              {imagePreview && <img src={imagePreview} alt="Preview" className='mt-2 rounded-md max-h-32 object-contain'/>}
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
                    {(['Available', 'Issued', 'Repair'] as ItemStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateAdded" className="text-right">Date of Entry</Label>
             <Controller
              name="dateAdded"
              control={control}
              render={({ field }) => (
                <Popover open={isDateAddedOpen} onOpenChange={setDateAddedOpen}>
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
                            if(date) field.onChange(date);
                            setDateAddedOpen(false);
                        }}
                        initialFocus
                        disabled={(date) => date > new Date()}
                    />
                    </PopoverContent>
                </Popover>
              )}
            />
             {errors.dateAdded && <p className="text-destructive text-xs mt-1">{errors.dateAdded.message}</p>}
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
