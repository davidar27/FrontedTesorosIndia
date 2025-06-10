import React, { useMemo, useState } from 'react';
import { Edit, LucideIcon, Check, X, Trash } from 'lucide-react';
import Picture from '@/components/ui/display/Picture';
import Avatar from '@/components/ui/display/Avatar';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';
import { normalizeEntrepreneurStatus, normalizeExperienceStatus } from '@/features/admin/adminHelpers';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';

interface StatusConfig {
    active: { bg: string; text: string; label: string };
    inactive: { bg: string; text: string; label: string };
    draft: { bg: string; text: string; label: string };
    published: { bg: string; text: string; label: string };
    pending: { bg: string; text: string; label: string };
    [key: string]: { bg: string; text: string; label: string };
}

interface ContactInfo {
    icon: LucideIcon;
    value: string | React.ReactNode;
    label?: string;
    onClick?: () => void; 
    copyable?: boolean;
}

interface StatInfo {
    value: string | number | React.ReactNode;
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

export interface BaseItem {
    id: number;
    name: string;
    status: string;
    image?: string;
    description?: string;
    subtitle?: string;
}

interface ReusableCardProps<T> {
    item: T;
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    actions?: ActionButton[];
    statusConfig?: StatusConfig;
    onEdit?: (item: T) => void;
    onChangeStatus?: (id: number, status: string) => void;
    onDelete?: (id: number) => void;
    showImage?: boolean;
    showStatus?: boolean;
    className?: string;
    variant?: 'default' | 'compact' | 'detailed';
    clickable?: boolean;
    onClick?: (item: T) => void;
    loading?: boolean;
    children?: React.ReactNode;
    title?: string;
}

// Configuración por defecto para estados
const DEFAULT_STATUS_CONFIG = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
    inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactivo' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
    published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Publicada' },
    draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Borrador' }
};

// Estilos para variantes de botones
const BUTTON_VARIANTS = {
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:bg-blue-50 disabled:text-blue-400 ',
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
        toast.success(`Copiado al portapapeles: ${text}`);
    } catch (err) {
        console.error('Error al copiar:', err);
    }
};


export function ReusableCard<T extends BaseItem>({
    item,
    contactInfo = [],
    stats = [],
    actions = [],
    statusConfig = DEFAULT_STATUS_CONFIG,
    onEdit,
    onChangeStatus,
    onDelete,
    showImage = true,
    showStatus = true,
    className = "",
    variant = 'default',
    clickable = false,
    onClick,
    loading = false,
    children,
    title
}: ReusableCardProps<T>) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'delete' | 'activate' | 'disable' | 'publish' | 'draft' | null>(null);

    const getStatusStyle = (status: string) => {
        const config = statusConfig[status] || statusConfig.active;
        return `${config.bg} ${config.text}`;
    };

    const getStatusLabel = (status: string) => {
        if (!status) return 'Desconocido';
        return statusConfig[status]?.label || status.charAt(0).toUpperCase() + status.slice(1);
    };

    const defaultActions: ActionButton[] = useMemo(() => {
        const actionsArr: ActionButton[] = [];
        const isExperience = title === 'Experiencia';
        const status = isExperience 
            ? normalizeExperienceStatus(item.status)
            : normalizeEntrepreneurStatus(item.status);
        
        if (onEdit) {
            actionsArr.push({
                icon: Edit,
                label: variant !== 'compact' ? 'Editar' : undefined,
                onClick: () => onEdit(item),
                variant: 'primary',
                fullWidth: variant === 'compact' ? false : true,
                tooltip: 'Editar elemento'
            });
        }

        if (isExperience) {
            if (status === 'published' && onChangeStatus) {
                actionsArr.push({
                    icon: X,
                    label: variant === 'default' ? 'Desactivar' : undefined,
                    onClick: () => handleActionWithConfirm('draft'),
                    variant: 'danger',
                    fullWidth: false,
                    tooltip: `Desactivar ${title}`
                });
            } else if (status === 'draft' && onChangeStatus) {
                actionsArr.push({
                    icon: Check,
                    label: variant === 'default' ? 'Publicar' : undefined,
                    onClick: () => handleActionWithConfirm('publish'),
                    variant: 'success',
                    fullWidth: false,
                    tooltip: `Publicar ${title}`
                });
            } else if (status === 'inactive' && onChangeStatus) {
                actionsArr.push({
                    icon: Check,
                    label: variant === 'default' ? 'Activar' : undefined,
                    onClick: () => handleActionWithConfirm('activate'),
                    variant: 'success',
                    fullWidth: false,
                    tooltip: `Activar ${title}`
                });
            }
        } else {
            if (status === 'active' && onChangeStatus) {
                actionsArr.push({
                    icon: X,
                    label: variant === 'default' ? 'Desactivar' : undefined,
                    onClick: () => handleActionWithConfirm('disable'),
                    variant: 'danger',
                    fullWidth: false,
                    tooltip: `Desactivar ${title}`
                });
            } else if (status === 'inactive' && onChangeStatus) {
                actionsArr.push({
                    icon: Check,
                    label: variant === 'default' ? 'Activar' : undefined,
                    onClick: () => handleActionWithConfirm('activate'),
                    variant: 'success',
                    fullWidth: false,
                    tooltip: `Activar ${title}`
                });
            } else if (status === 'pending' && onDelete) {
                actionsArr.push({
                    icon: Trash,
                    label: variant === 'default' ? 'Eliminar' : undefined,
                    onClick: () => handleActionWithConfirm('delete'),
                    variant: 'danger',
                    fullWidth: false,
                    tooltip: `Eliminar ${title}`
                });
            }
        }
        return actionsArr;
    }, [onEdit, onChangeStatus, onDelete, item, variant, title]);

    const finalActions = actions.length > 0 ? actions : defaultActions;

    const handleContactClick = (contact: ContactInfo) => {
        if (contact.onClick) {
            contact.onClick();
        } else if (contact.copyable && typeof contact.value === 'string') {
            copyToClipboard(contact.value);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if (clickable && onClick && !loading) {
            const target = e.target as HTMLElement;
            if (!target.closest('button')) {
                onClick(item);
            }
        }
    };

    const handleActionWithConfirm = (action: 'delete' | 'activate' | 'disable' | 'publish' | 'draft') => {
        setConfirmAction(action);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;
        
        switch (confirmAction) {
            case 'delete':
                if (onDelete) onDelete(item.id);
                break;
            case 'activate':
                if (onChangeStatus) onChangeStatus(item.id, 'active');
                break;
            case 'disable':
                if (onChangeStatus) onChangeStatus(item.id, 'inactive');
                break;
            case 'publish':
                if (onChangeStatus) onChangeStatus(item.id, 'published');
                break;
            case 'draft':
                if (onChangeStatus) onChangeStatus(item.id, 'draft');
                break;
        }
        setConfirmOpen(false);
        setConfirmAction(null);
    };

    const isActionDisabled = confirmOpen || loading;

    const cardClasses = `
        bg-white rounded-2xl shadow-lg border border-gray-100 
        hover:shadow-xl transition-all duration-300 group animate-fade-in-up 
        ${CARD_VARIANTS[variant]}
        ${clickable ? 'cursor-pointer hover:border-primary/20' : ''}
        ${loading ? 'opacity-60 pointer-events-none' : ''}
        ${className}
    `.trim();


    return (
        <div className={cardClasses} style={{ position: 'relative' }} onClick={handleCardClick}>
            {/* Loading Spinner superpuesto */}
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20
                }}>
                    <LoadingSpinner message="Cargando..." />
                </div>
                )}
            {/* Header */}
            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3
                        className={`font-bold text-gray-800 group-hover:text-primary transition-colors duration-200 truncate ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}
                        title={item.name}
                    >
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
                                className={`rounded-full object-cover ${variant === 'compact' ? 'w-10 h-10' : 'w-12 h-12'}`}
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
                <div className={`space-y-2 mb-4 flex gap-2 flex-wrap flex-col w-full  ${variant === 'compact' ? 'items-center ' : ''}`}>
                    {contactInfo.map((contact, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-gray-600 w-auto ${contact.onClick || contact.copyable ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
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
                <div className={`grid gap-3 mb-6 ${stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center p-3 rounded-lg transition-colors ${stat.bgColor || 'bg-gray-50'} ${stat.onClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                            onClick={stat.onClick}
                        >
                            {stat.icon && (
                                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.textColor || 'text-primary'}`} />
                            )}
                            <div className={`text-lg font-bold truncate ${stat.textColor || 'text-primary'}`}
                            title={stat.value?.toString() || ''}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Children */}
            {children}

            {/* Actions */}
            {finalActions.length > 0 && (
                <div className={`flex gap-2 ${variant === 'compact' ? 'flex-wrap' : ''}`}>
                    {finalActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled || action.loading || isActionDisabled}
                            title={action.tooltip}
                            className={`
                                ${action.fullWidth ? 'flex-1' : ''} 
                                flex items-center justify-center !gap-2 !px-4 !py-2 !rounded-lg 
                                transition-all duration-200 font-medium text-sm cursor-pointer
                                ${BUTTON_VARIANTS[action.variant || 'primary']}
                                ${action.disabled ? 'cursor-not-allowed' : 'hover:!scale-105'}
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

            <ConfirmDialog
                open={confirmOpen}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
                title={
                    confirmAction === 'delete'
                        ? `¿Eliminar ${title}?`
                        : confirmAction === 'activate'
                        ? `¿Activar ${title}?`
                        : confirmAction === 'disable'
                        ? `¿Desactivar ${title}?`
                        : confirmAction === 'publish'
                        ? `¿Publicar ${title}?`
                        : confirmAction === 'draft'
                        ? `¿Borrador ${title}?`
                        : `¿Desactivar ${title}?`
                }
                description={
                    confirmAction === 'delete'
                        ? 'Esta acción no se puede deshacer. ¿Deseas continuar?'
                        : confirmAction === 'activate'
                        ? `¿Deseas activar ${item.name}?`
                        : confirmAction === 'disable'
                        ? `¿Deseas desactivar ${item.name}?`
                        : confirmAction === 'publish'
                        ? `¿Deseas publicar ${item.name}?`
                        : confirmAction === 'draft'
                        ? `¿Deseas poner en borrador ${item.name}?`
                        : `¿Deseas desactivar ${item.name}?`
                }
                confirmText={
                    confirmAction === 'delete'
                        ? 'Eliminar'
                        : confirmAction === 'activate'
                        ? 'Activar'
                        : confirmAction === 'disable'
                        ? 'Desactivar'
                        : confirmAction === 'publish'
                        ? 'Publicar'
                        : confirmAction === 'draft'
                        ? 'Borrador'
                        : 'Desactivar'
                }
            />
        </div>
    );
}