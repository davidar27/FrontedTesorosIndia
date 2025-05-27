import React, { useMemo } from 'react';
import { Edit, Trash2, LucideIcon, ExternalLink } from 'lucide-react';
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
    onClick?: () => void; // Para hacer clickeable (ej: teléfono, email)
    copyable?: boolean; // Para poder copiar al clipboard
}

interface StatInfo {
    value: string | number;
    label: string;
    bgColor?: string;
    textColor?: string;
    icon?: LucideIcon;
    onClick?: () => void;
}

interface ActionButton {
    icon: LucideIcon;
    label?: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    tooltip?: string;
}

interface BaseItem {
    id: number;
    name: string;
    status: string;
    image?: string;
    description?: string;
    subtitle?: string;
}

interface ReusableCardProps<T extends BaseItem> {
    item: T;
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    actions?: ActionButton[];
    statusConfig?: StatusConfig;
    onEdit?: (item: T) => void;
    onDelete?: (id: number) => void;
    onView?: (item: T) => void;
    showImage?: boolean;
    showStatus?: boolean;
    className?: string;
    variant?: 'default' | 'compact' | 'detailed';
    clickable?: boolean;
    onClick?: (item: T) => void;
    loading?: boolean;
}

// Configuración por defecto para estados
const DEFAULT_STATUS_CONFIG: StatusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
    inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactivo' },
    draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Borrador' },
    pending: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pendiente' },
    completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completado' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archivado' },
    processing: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Procesando' },
};

// Estilos para variantes de botones
const BUTTON_VARIANTS = {
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:bg-blue-50 disabled:text-blue-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400',
    danger: 'bg-red-100 hover:bg-red-200 text-red-700 disabled:bg-red-50 disabled:text-red-400',
    success: 'bg-green-100 hover:bg-green-200 text-green-700 disabled:bg-green-50 disabled:text-green-400',
    warning: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 disabled:bg-yellow-50 disabled:text-yellow-400',
};

// Estilos para variantes de tarjeta
const CARD_VARIANTS = {
    default: 'p-6',
    compact: 'p-4',
    detailed: 'p-8',
};

// Función helper para copiar al clipboard
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        // Aquí podrías agregar un toast notification
        console.log('Copiado al portapapeles:', text);
    } catch (err) {
        console.error('Error al copiar:', err);
    }
};

// Componente de Loading Spinner
const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <div
        className="animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: size, height: size }}
    />
);


export function ReusableCard<T extends BaseItem>({
    item,
    contactInfo = [],
    stats = [],
    actions = [],
    statusConfig = DEFAULT_STATUS_CONFIG,
    onEdit,
    onDelete,
    onView,
    showImage = true,
    showStatus = true,
    className = "",
    variant = 'default',
    clickable = false,
    onClick,
    loading = false
}: ReusableCardProps<T>) {

    const getStatusStyle = (status: string) => {
        const config = statusConfig[status] || statusConfig.active;
        return `${config.bg} ${config.text}`;
    };

    const getStatusLabel = (status: string) => {
        if (!status) return 'Desconocido';

        console.log('Status:', status);
        return statusConfig[status]?.label || status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Acciones por defecto si se proporcionan callbacks
    const defaultActions: ActionButton[] = useMemo(() => [
        ...(onView ? [{
            icon: ExternalLink,
            label: variant !== 'compact' ? 'Ver' : undefined,
            onClick: () => onView(item),
            variant: 'secondary' as const,
            fullWidth: false,
            tooltip: 'Ver detalles'
        }] : []),
        ...(onEdit ? [{
            icon: Edit,
            label: variant !== 'compact' ? 'Editar' : undefined,
            onClick: () => onEdit(item),
            variant: 'primary' as const,
            fullWidth: variant === 'compact' ? false : true,
            tooltip: 'Editar elemento'
        }] : []),
        ...(onDelete ? [{
            icon: Trash2,
            label: variant === 'detailed' ? 'Eliminar' : undefined,
            onClick: () => onDelete(item.id),
            variant: 'danger' as const,
            fullWidth: false,
            tooltip: 'Eliminar elemento'
        }] : [])
    ], [onView, onEdit, onDelete, item, variant]);

    const finalActions = actions.length > 0 ? actions : defaultActions;

    const handleCardClick = (e: React.MouseEvent) => {
        if (clickable && onClick && !loading) {
            // No activar si se hizo click en un botón o elemento interactivo
            const target = e.target as HTMLElement;
            if (!target.closest('button')) {
                onClick(item);
            }
        }
    };

    const handleContactClick = (contact: ContactInfo) => {
        if (contact.onClick) {
            contact.onClick();
        } else if (contact.copyable) {
            copyToClipboard(contact.value);
        }
    };

    const cardClasses = `
        bg-white rounded-2xl shadow-lg border border-gray-100 
        hover:shadow-xl transition-all duration-300 group animate-fade-in-up 
        ${CARD_VARIANTS[variant]}
        ${clickable ? 'cursor-pointer hover:border-primary/20' : ''}
        ${loading ? 'opacity-60 pointer-events-none' : ''}
        ${className}
    `.trim();

    if (loading) {
        return (
            <div className={cardClasses}>
                <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className={cardClasses} onClick={handleCardClick}>
            {/* Header */}
            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0"> {/* min-w-0 para truncate */}
                    <h3 className={`font-bold text-gray-800 group-hover:text-primary transition-colors duration-200 truncate ${variant === 'compact' ? 'text-lg' : 'text-xl'
                        }`}>
                        {item.name}
                    </h3>

                    {item.subtitle && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                            {item.subtitle}
                        </p>
                    )}

                    {item.description && variant === 'detailed' && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {item.description}
                        </p>
                    )}

                    {showStatus && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusStyle(item.status)}`}>
                            {getStatusLabel(item.status)}
                        </span>
                    )}
                </div>

                {/* Image/Avatar */}
                {showImage && (
                    <div className="ml-4 flex-shrink-0">
                        {item.image ? (
                            <Picture
                                src={item.image}
                                alt={item.name}
                                className={`rounded-full object-cover ${variant === 'compact' ? 'w-10 h-10' : 'w-12 h-12'
                                    }`}
                            />
                        ) : (
                            <Avatar
                                name={item.name}
                                size={variant === 'compact' ? 40 : 48}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Contact Info */}
            {contactInfo.length > 0 && (
                <div className="space-y-2 mb-4">
                    {contactInfo.map((contact, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-gray-600 ${contact.onClick || contact.copyable
                                    ? 'cursor-pointer hover:text-primary transition-colors'
                                    : ''
                                }`}
                            onClick={() => handleContactClick(contact)}
                            title={contact.copyable ? 'Click para copiar' : contact.label}
                        >
                            <contact.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{contact.value}</span>
                            {contact.label && variant === 'detailed' && (
                                <span className="text-xs text-gray-400">({contact.label})</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
                <div className={`grid gap-3 mb-6 ${stats.length === 1 ? 'grid-cols-1' :
                        stats.length === 2 ? 'grid-cols-2' :
                            stats.length === 3 ? 'grid-cols-3' :
                                stats.length === 4 ? 'grid-cols-2' :
                                    'grid-cols-2'
                    }`}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center p-3 rounded-lg transition-colors ${stat.bgColor || 'bg-gray-50'
                                } ${stat.onClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                            onClick={stat.onClick}
                        >
                            {stat.icon && (
                                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.textColor || 'text-primary'
                                    }`} />
                            )}
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
                <div className={`flex gap-2 ${variant === 'compact' ? 'flex-wrap' : ''}`}>
                    {finalActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled || action.loading}
                            title={action.tooltip}
                            className={`
                                ${action.fullWidth ? 'flex-1' : ''} 
                                flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                                transition-all duration-200 font-medium text-sm
                                ${BUTTON_VARIANTS[action.variant || 'primary']}
                                ${action.disabled ? 'cursor-not-allowed' : 'hover:scale-105'}
                            `}
                        >
                            {action.loading ? (
                                <LoadingSpinner />
                            ) : (
                                <action.icon className="w-4 h-4" />
                            )}
                            {action.label && <span>{action.label}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}