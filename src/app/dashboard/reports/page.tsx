
'use client';

import { ReportsView } from "@/components/dashboard/reports-view";
import { useItems } from "@/hooks/use-items";

export default function ReportsPage() {
    const { items, isLoading } = useItems();

    if (isLoading) {
        return <div>Loading reports...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">
                    Weekly Reports & Analytics
                </h1>
            </div>
            <ReportsView allItems={items} />
        </div>
    );
}
