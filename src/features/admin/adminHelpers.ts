import { EntrepreneurStatus } from './entrepreneurs/EntrepreneursTypes';
import { Experiencestatus } from './experiences/ExperienceTypes';

export function formatDate(dateStr: string) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
}

export const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    try {
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_API_URL}${imagePath}`;
    } catch (error) {
        console.error('Error procesando ruta de imagen:', error);
        return null;
    }
};

export function normalizeEntrepreneurStatus(status: string): EntrepreneurStatus {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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

export function normalizeExperienceStatus(status: string): Experiencestatus {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
        case 'publicada':
        case 'published':
            return 'published';
        case 'borrador':
        case 'draft':
            return 'draft';
        case 'inactivo':
        case 'inactive':
            return 'inactive';
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
            case 'pending':
                return 'Pendiente';
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