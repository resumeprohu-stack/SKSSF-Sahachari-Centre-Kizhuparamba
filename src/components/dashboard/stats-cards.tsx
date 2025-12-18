import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowUpRight, ArrowDownLeft, AlertTriangle, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    issued: number;
    returned: number;
    available: number;
    overdue: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    { title: 'Total Items', value: stats.total, icon: Package, color: 'text-sky-500' },
    { title: 'Issued Items', value: stats.issued, icon: ArrowUpRight, color: 'text-amber-500' },
    { title: 'Returned Items', value: stats.returned, icon: ArrowDownLeft, color: 'text-green-500' },
    { title: 'Available Items', value: stats.available, icon: CheckCircle, color: 'text-blue-500' },
    { title: 'Overdue Items', value: stats.overdue, icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
