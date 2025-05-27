import { ReusableCard } from "@/components/admin/Card";
import { Package } from "@/features/admin/packages/PackageTypes";
import { Info } from "lucide-react";




function PackageCard({ item, onEdit, onDelete }: { item: Package; onEdit: (item: Package) => void; onDelete: (id: number) => void }) {
    const stats = [
        { value: `$${item.price}`, label: 'Precio', bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { value: item.duration, label: 'Duración', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { value: item.capacity, label: 'Capacidad', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
        { value: item.category, label: 'Categoría', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
    ];

    const contactInfo = [
        { icon: Info, value: item.description },
    ];

    return (
        <ReusableCard
            item={item}
            contactInfo={contactInfo}
            stats={stats}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}

export default PackageCard;