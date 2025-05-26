import { useState } from 'react';
import { Leaf, Coffee, Mountain, User, MoreVertical, Eye, Edit3, Trash2, MapPin} from 'lucide-react';


export interface Farm {
    id: number;
    name: string;
    entrepreneur: string;
    location: string;
    cropType: string;
    status: 'active' | 'inactive' | 'draft';
    coordinates?: { lat: number; lng: number };
}


interface FarmCardProps {
    item: Farm;
    onEdit: (farm: Farm) => void;
    onDelete: (farmId: number) => void;
    onView: (farm: Farm) => void;
}



const FarmCard: React.FC<FarmCardProps> = ({ item, onEdit, onDelete, onView }) => {
    const [showActions, setShowActions] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'draft':
                return 'bg-[#eee41e]/20 text-yellow-700 border-[#eee41e]/30';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Leaf className="w-4 h-4" />;
            case 'inactive':
                return <Coffee className="w-4 h-4" />;
            case 'draft':
                return <Mountain className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 animate-fade-in-up ${isHovered ? 'scale-[1.02] -translate-y-1' : ''
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header con gradiente personalizado */}
            <div className="bg-gradient-to-r from-primary to-[#81c9c1] p-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 text-green-100">
                            <User className="w-4 h-4" />
                            <span className="text-sm truncate">{item.entrepreneur}</span>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showActions && (
                            <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border py-2 z-20 min-w-[140px] animate-fade-in-right">
                                <button
                                    onClick={() => onView(item)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                    <Eye className="w-4 h-4" />
                                    Ver detalles
                                </button>
                                <button
                                    onClick={() => onEdit(item)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-primary"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-6 -top-6 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-white/5 rounded-full" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm truncate">{item.location}</span>
                </div>



                {/* Crop type */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cultivo:</span>
                    <span className="bg-green-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {item.cropType}
                    </span>
                </div>

                {/* Status and last visit */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status === 'active' ? 'Activa' : item.status === 'inactive' ? 'Inactiva' : 'Borrador'}</span>
                    </div>
                </div>
            </div>

            {/* Hover overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-[#81c9c1]/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
        </div>
    );
};


export default FarmCard;