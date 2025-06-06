export function normalizeStatus(status: string): 'active' | 'inactive' | 'pending' {
    switch (status?.toLowerCase()) {
        case 'activo':
        case 'active':
            return 'active';
        case 'inactivo':
        case 'inactive':
            return 'inactive';
        case 'pendiente':
        case 'pending':
            return 'pending';
        default:
            return 'inactive';
    }
}