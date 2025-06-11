import { Package } from "./PackageTypes";
import PackageCard from "./PackagesCard";

interface PackageCardWrapperProps {
    item: Package;
    onUpdate?: (item: Package) => void;
    onDelete?: (id: number) => void;
}

export function PackageCardWrapper({ item, onUpdate, onDelete }: PackageCardWrapperProps) {
    const handleEdit = (item: Package) => {
        onUpdate?.(item);
    };

    const handleDelete = (id: number) => {
        onDelete?.(id);
    };

    return (
        <PackageCard
            item={item}
            onUpdate={handleEdit}
            onDelete={handleDelete}
        />
    );
} 