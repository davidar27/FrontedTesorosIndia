import { Edit, Trash2 } from "lucide-react";

interface PackageActionsProps {
    isEditable: boolean;
    status?: string;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: string) => void;
}

export  const PackageActions: React.FC<PackageActionsProps> = ({
    isEditable,
    status,
    onEdit,
    onDelete,
    onStatusChange
}) => (
    <div className="flex gap-2">
        <button
            onClick={onEdit}
            disabled={!isEditable}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar paquete"
        >
            <Edit className="h-5 w-5" />
        </button>
        <button
            onClick={onDelete}
            disabled={!isEditable}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar paquete"
        >
            <Trash2 className="h-5 w-5" />
        </button>
        {status && (
            <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={!isEditable}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="draft">Borrador</option>
            </select>
        )}
    </div>
);