import { Edit, Trash2, LucideIcon } from 'lucide-react';
import Picture from '@/components/ui/Picture';
import Avatar from '@/components/ui/Avatar';

// Interfaces genéricas para hacer el componente reutilizable
interface StatusConfig {
    active: { bg: string; text: string; label: string };
    inactive: { bg: string; text: string; label: string };
    draft: { bg: string; text: string; label: string };
    [key: string]: { bg: string; text: string; label: string };
}

interface ContactInfo {
    icon: LucideIcon;
    value: string;
    label?: string;
}

interface StatInfo {
    value: string | number;
    label: string;
    bgColor?: string;
    textColor?: string;
}

interface ActionButton {
    icon: LucideIcon;
    label?: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    fullWidth?: boolean;
}

interface BaseItem {
    id: number;
    name: string;
    status: string;
    image?: string;
}

interface ReusableCardProps<T extends BaseItem> {
    item: T;
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    actions?: ActionButton[];
    statusConfig?: StatusConfig;
    onEdit?: (item: T) => void;
    onDelete?: (id: number) => void;
    showImage?: boolean;
    className?: string;
}

// Configuración por defecto para estados
const DEFAULT_STATUS_CONFIG: StatusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
    inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactivo' },
    draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Borrador' },
    pending: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pendiente' },
    completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completado' },
};

// Estilos para variantes de botones
const BUTTON_VARIANTS = {
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-100 hover:bg-red-200 text-red-700',
    success: 'bg-green-100 hover:bg-green-200 text-green-700',
};

export function ReusableCard<T extends BaseItem>({
    item,
    contactInfo = [],
    stats = [],
    actions = [],
    statusConfig = DEFAULT_STATUS_CONFIG,
    onEdit,
    onDelete,
    showImage = true,
    className = ""
}: ReusableCardProps<T>) {

    const getStatusStyle = (status: string) => {
        const config = statusConfig[status] || statusConfig.active;
        return `${config.bg} ${config.text}`;
    };

    const getStatusLabel = (status: string) => {
        return statusConfig[status]?.label || status;
    };

    // Acciones por defecto si se proporcionan onEdit y onDelete
    const defaultActions: ActionButton[] = [
        ...(onEdit ? [{
            icon: Edit,
            label: 'Editar',
            onClick: () => onEdit(item),
            variant: 'primary' as const,
            fullWidth: true
        }] : []),
        ...(onDelete ? [{
            icon: Trash2,
            onClick: () => onDelete(item.id),
            variant: 'danger' as const,
            fullWidth: false
        }] : [])
    ];

    const finalActions = actions.length > 0 ? actions : defaultActions;

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group animate-fade-in-up ${className}`}>
            {/* Header */}
            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
                        {item.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusStyle(item.status)}`}>
                        {getStatusLabel(item.status)}
                    </span>
                </div>

                {/* Image/Avatar */}
                {showImage && (
                    <div className="ml-4">
                        {item.image ? (
                            <Picture
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <Avatar
                                name={item.name}
                                size={48}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Contact Info */}
            {contactInfo.length > 0 && (
                <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-1 gap-2">
                        {contactInfo.map((contact, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-600">
                                <contact.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm truncate">{contact.value}</span>
                                {contact.label && (
                                    <span className="text-xs text-gray-400">({contact.label})</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
                <div className={`grid gap-4 mb-6 ${stats.length === 1 ? 'grid-cols-1' :
                    stats.length === 2 ? 'grid-cols-2' :
                        stats.length === 3 ? 'grid-cols-2' :
                                'grid-cols-2'
                    }`}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center p-3 rounded-lg ${stat.bgColor || 'bg-gray-50'
                                }`}
                        >
                            <p className={`text-lg font-bold ${stat.textColor || 'text-primary'
                                }`}>
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            {finalActions.length > 0 && (
                <div className="flex gap-2">
                    {finalActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`
                ${action.fullWidth ? 'flex-1' : ''} 
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                transition-colors duration-200 font-medium text-sm
                ${BUTTON_VARIANTS[action.variant || 'primary']}
              `}
                        >
                            <action.icon className="w-4 h-4" />
                            {action.label && <span>{action.label}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}