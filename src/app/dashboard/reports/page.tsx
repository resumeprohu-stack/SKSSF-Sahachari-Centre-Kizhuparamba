import { ReportsView } from "@/components/dashboard/reports-view";
import { items } from "@/lib/data";

export default function ReportsPage() {
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
