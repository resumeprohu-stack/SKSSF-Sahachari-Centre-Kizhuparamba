'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { addDays, format, parseISO, isWithinInterval } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { Item } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { Calendar } from '../ui/calendar';

interface ReportsViewProps {
  allItems: Item[];
}

export function ReportsView({ allItems }: ReportsViewProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const filteredItems = allItems.filter(item => {
    if (!date?.from || !date?.to) return true;
    const dateAdded = parseISO(item.dateAdded);
    return isWithinInterval(dateAdded, { start: date.from, end: date.to });
  });

  const itemsAdded = filteredItems.length;
  const itemsIssued = filteredItems.filter(item => item.issueDate && isWithinInterval(parseISO(item.issueDate), { start: date!.from!, end: date!.to! })).length;
  const itemsReturned = filteredItems.filter(item => item.actualReturnDate && isWithinInterval(parseISO(item.actualReturnDate), { start: date!.from!, end: date!.to! })).length;
  const itemsPending = allItems.filter(item => item.status === 'Issued').length;

  const chartData = [
    { name: 'Added', value: itemsAdded, fill: 'var(--color-added)' },
    { name: 'Issued', value: itemsIssued, fill: 'var(--color-issued)' },
    { name: 'Returned', value: itemsReturned, fill: 'var(--color-returned)' },
    { name: 'Pending', value: itemsPending, fill: 'var(--color-pending)' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Filter by Date Range</CardTitle>
            <div className="flex items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Displaying data for the selected period.
            </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader><CardTitle>Items Added</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{itemsAdded}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Items Issued</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{itemsIssued}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Items Returned</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{itemsReturned}</p></CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Pending Return</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{itemsPending}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>A summary of item activities in the selected date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} style={{
                '--color-added': 'hsl(var(--chart-1))',
                '--color-issued': 'hsl(var(--chart-2))',
                '--color-returned': 'hsl(var(--chart-3))',
                '--color-pending': 'hsl(var(--chart-4))',
            } as React.CSSProperties}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
              />
              <Legend />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
