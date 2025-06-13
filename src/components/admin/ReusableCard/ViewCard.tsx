import React, { useMemo, useState } from 'react';
import { Edit, LucideIcon, Check, X } from 'lucide-react';
import Picture from '@/components/ui/display/Picture';
import Avatar from '@/components/ui/display/Avatar';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';
import { getImageUrl, getStatusLabel, normalizeEntrepreneurStatus, normalizeExperienceStatus } from '@/features/admin/adminHelpers';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { BaseItem } from './types';

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

interface ViewCardProps<T> {
    item: T;
    contactInfo?: ContactInfo[];
    stats?: StatInfo[];
    actions?: ActionButton[];
    onUpdate?: (item: T) => void;
    onChangeStatus?: (id: number, status: string) => void;
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

const BUTTON_VARIANTS = {
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:bg-blue-50 disabled:text-blue-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400',
    danger: 'bg-red-100 hover:bg-red-200 text-red-700 disabled:bg-red-50 disabled:text-red-400',
    success: 'bg-green-100 hover:bg-green-200 text-green-700 disabled:bg-green-50 disabled:text-green-400',
    warning: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 disabled:bg-yellow-50 disabled:text-yellow-400',
};

const CARD_VARIANTS = {
    default: 'p-6',
    compact: 'p-4',
    detailed: 'p-8',
};

export function ViewCard<T extends BaseItem>({
    item,
    contactInfo = [],
    stats = [],
    actions = [],
    onUpdate,
    onChangeStatus,
    showImage = true,
    className = "",
    variant = 'default',
    clickable = false,
    onClick,
    loading = false,
    children,
    title
}: ViewCardProps<T>) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'activate' | 'disable' | 'publish' | 'draft' | null>(null);

    const defaultActions: ActionButton[] = useMemo(() => {
        const actionsArr: ActionButton[] = [];
        const isExperience = title === 'Experiencia';
        const status = isExperience 
            ? normalizeExperienceStatus(item.status)
            : normalizeEntrepreneurStatus(item.status);
        
        if (onUpdate) {
            actionsArr.push({
                icon: Edit,
                label: variant !== 'compact' ? 'Editar' : undefined,
                onClick: () => onUpdate(item),
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
            }
        }
        return actionsArr;
    }, [onUpdate, onChangeStatus, item, variant, title]);

    const finalActions = actions.length > 0 ? actions : defaultActions;

    const handleActionWithConfirm = (action: 'activate' | 'disable' | 'publish' | 'draft') => {
        setConfirmAction(action);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;
        
        switch (confirmAction) {
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

    const handleCardClick = (e: React.MouseEvent) => {
        if (clickable && onClick && !loading) {
            const target = e.target as HTMLElement;
            if (!target.closest('button')) {
                onClick(item);
            }
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

    return (
        <div className={cardClasses} style={{ position: 'relative' }} onClick={handleCardClick}>
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

            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-200 truncate whitespace-normal text-xl">
                        {item.name}
                    </h3>
                </div>
                
                {showStatus && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusStyle(item.status)}`}>
                            {getStatusLabel(item.status)}
                        </span>
                    )}

                {showImage && (
                    <div className="ml-4 flex-shrink-0">
                        {item.image && item.image !== null ? (
                            <Picture
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="rounded-full object-cover w-12 h-12"
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

            {contactInfo.length > 0 && (
                <div className="space-y-2 mb-4 flex gap-2 flex-wrap flex-col w-full">
                    {contactInfo.map((contact, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-gray-600"
                        >
                            <contact.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate whitespace-normal">{contact.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {stats.length > 0 && (
                <div className={`grid gap-3 mb-6 ${stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-3 rounded-lg bg-green-50"
                        >
                            {stat.icon && (
                                <stat.icon className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            )}
                            <div className="text-lg font-bold truncate text-green-600">
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {children}

            {finalActions.length > 0 && (
                <div className="flex gap-2">
                    {finalActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled || action.loading || loading}
                            title={action.tooltip}
                            className={`
                                ${action.fullWidth ? 'flex-1' : ''} 
                                flex items-center justify-center !gap-2 !px-4 !py-2 !rounded-lg 
                                transition-all duration-200 font-medium text-sm cursor-pointer w-full
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
                    confirmAction === 'activate'
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
                    confirmAction === 'activate'
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
                    confirmAction === 'activate'
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