import { SearchResult } from "@/services/home/search";

export const getResultTypeLabel = (type: SearchResult['type']): string => {
    const typeLabels = {
        'product': 'Producto',
        'package': 'Paquete',
        'experience': 'Experiencia'
    } as const;

    return typeLabels[type] || 'Resultado';
};
