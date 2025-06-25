import { Coffee, BedDouble, Bubbles, Leaf, UtensilsCrossed, Mountain } from 'lucide-react';

// Mapea el tipo de experiencia a un componente de ícono específico y un color de Tailwind.
export const getExperienceTypeDetails = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'café':
            return { Icon: Coffee, color: 'from-amber-500 to-orange-600' };
        case 'hostal':
            return { Icon: BedDouble, color: 'from-indigo-500 to-purple-600' };
        case 'masajes':
            return { Icon: Bubbles, color: 'from-pink-500 to-rose-600' };
        case 'agroecologia':
            return { Icon: Leaf, color: 'from-green-500 to-emerald-600' };
        case 'gastronomia':
            return { Icon: UtensilsCrossed, color: 'from-red-500 to-pink-600' };
        default:
            return { Icon: Mountain, color: 'from-gray-500 to-gray-600' }; // Un ícono y color por defecto
    }
}; 