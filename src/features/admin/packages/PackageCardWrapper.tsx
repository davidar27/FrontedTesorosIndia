import { Package } from "./PackageTypes";
import PackageCard from "./PackagesCard";

interface PackageCardWrapperProps {
    item: Package;
    onEdit?: (item: Package) => void;
    onDelete?: (id: number) => void;
}

export function PackageCardWrapper({ item, onEdit, onDelete }: PackageCardWrapperProps) {
    const handleEdit = (item: Package) => {
        onEdit?.(item);
    };

    const handleDelete = (id: number) => {
        onDelete?.(id);
    };

    return (
        <PackageCard
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
} 