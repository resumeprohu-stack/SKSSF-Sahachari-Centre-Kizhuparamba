import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.category}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge
          className={cn(
            item.status === 'Available' && 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
            item.status === 'Issued' && 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
            "capitalize"
          )}
          variant="outline"
        >
          {item.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
