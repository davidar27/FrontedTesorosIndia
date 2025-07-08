
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    try {
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_API_URL}/images/${imagePath}`;
    } catch (error) {
        console.error('Error procesando ruta de imagen:', error);
        return null;
    }
};
