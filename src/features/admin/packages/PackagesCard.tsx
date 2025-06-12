import { ReusableCard } from "@/components/admin/Card";
import { Package } from "@/features/admin/packages/PackageTypes";
import { Calendar, DollarSign, Info } from "lucide-react";

interface PackageCardProps {
    item: Package;
    onUpdate?: (item: Package) => void;
    onDelete?: (id: number) => void;
}

function PackageCard({ item, onUpdate, onDelete }: PackageCardProps) {
    const stats = [
        { value: `${item.duration}H`, label: 'Duración', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { value: item.capacity, label: 'Capacidad (personas)', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },

    ];

    const contactInfo = [
        { icon: Info, value: item.description, label: 'Descripción' },
        { icon: Calendar, value: item.joinDate, label: 'Fecha de creación' },
        { icon: DollarSign, value: item.price, label: 'Precio',  },

    ];

    return (
        <ReusableCard<Package>
            item={item}
            contactInfo={contactInfo}
            stats={stats}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showStatus={true}
            title='Paquete'
            loading={false}
            variant="default"
        />
    );
}

export default PackageCard;