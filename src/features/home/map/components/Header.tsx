import React from 'react';
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';

export const Header: React.FC = () => (
    <div className="text-center pb-8">
        <AnimatedTitle
            title='RUTA TURÍSTICA'
            align="center"
            mdAlign="center"
        />
        <p className="text-gray-700 max-w-2xl mx-auto text-lg mt-4 leading-relaxed">
            ¡Bienvenidos a la vereda La India, una joya escondida en las montañas de Filandia, Quindío!
        </p>
    </div>
);