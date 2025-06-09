export function formatDate(dateStr: string) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
}

export  const normalizeStatus = (status: string) => {
    switch (status.toLowerCase()) {
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
};
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