import { EntrepreneurStatus } from './entrepreneurs/EntrepreneursTypes';
import { Experiencestatus } from './experiences/ExperienceTypes';

export function formatDate(dateStr: string | undefined | null) {
    if (!dateStr) return 'No disponible';
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
}

export function normalizeStatus(status: string): EntrepreneurStatus | Experiencestatus {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
        case 'activo':
        case 'active':
            return 'active';
        case 'inactivo':
        case 'inactive':
            return 'inactive';
        case 'publicada':
        case 'published':
            return 'published';
        case 'borrador':
        case 'draft':
            return 'draft';
        default:
            return 'inactive';
    }
}



export function getStatusLabel(status: string, entityType: 'entrepreneur' | 'experience'): string {
    if (entityType === 'entrepreneur') {
        switch (status.toLowerCase()) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            default:
                return 'Desconocido';
        }
    } else {
        switch (status.toLowerCase()) {
            case 'published':
                return 'Publicada';
            case 'draft':
                return 'Borrador';
            case 'inactive':
                return 'Inactivo';
            default:
                return 'Desconocido';
        }
    }
}