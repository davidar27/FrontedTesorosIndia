import { Users } from "lucide-react";
import { PackageData } from "../types/packagesTypes";
import { getStatusConfig } from "../utils/getStatusConfig";
import { PackageActions } from "./PackageActions";

interface PackageHeaderProps {
    packageData: PackageData;
    showActions: boolean;
    isEditable: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: string) => void;
}

export const PackageHeader: React.FC<PackageHeaderProps> = ({
    packageData,
    showActions,
    isEditable,
    onEdit,
    onDelete,
    onStatusChange
}) => {
    const statusConfig = getStatusConfig(packageData.status);

    return (
        <header className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl font-extrabold text-primary">
                            {packageData.name}
                        </h1>
                        {packageData.status && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        {packageData.createdAt && (
                            <span>
                                Creado: {new Date(packageData.createdAt).toLocaleDateString()}
                            </span>
                        )}
                        {packageData.bookingsCount !== undefined && (
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {packageData.bookingsCount} reservas
                            </span>
                        )}
                    </div>
                </div>

                {showActions && (
                    <PackageActions
                        isEditable={isEditable}
                        status={packageData.status}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                    />
                )}
            </div>
        </header>
    );
};