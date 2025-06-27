export const STATUS_CONFIG = {
    active: {
        label: 'Activo',
        className: 'bg-green-100 text-green-800 border-green-200'
    },
    inactive: {
        label: 'Inactivo',
        className: 'bg-red-100 text-red-800 border-red-200'
    },
    draft: {
        label: 'Borrador',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
} as const;

export const getStatusConfig = (status?: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
        label: 'Sin estado',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    };
};