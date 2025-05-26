import { Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { Package } from '@/components/admin/packages/PackagesManagement';


interface PackageCardProps {
    item: Package;
    onEdit: (item: Package) => void;
    onDelete: (id: number) => void;
    onView: (item: Package) => void;
}

export function PackageCard({ item, onEdit, onDelete, onView }: PackageCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'inactive': return 'Inactivo';
            case 'draft': return 'Borrador';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group animate-fade-in-up">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
                        {item.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                    </span>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{item.description}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{item.weight}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{item.price}</p>
                    <p className="text-xs text-gray-600">Precio</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-600">{item.status}</p>
                    <p className="text-xs text-gray-600">Estado</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => onView(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Ver</span>
                </button>
                <button
                    onClick={() => onEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200"
                >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}