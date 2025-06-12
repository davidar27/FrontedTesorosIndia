import React, { useState, useEffect } from 'react';
import { Coffee, X, Flower, Flower2, Leaf, Shrub, Waves, UtensilsCrossed, Tent, TreePalm } from 'lucide-react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import ButtonIcon from '../ui/buttons/ButtonIcon';
import { ExperiencesApi } from '@/services/home/experiences';

interface SidebarExperiencesProps {
    isOpen: boolean;
    onClose: () => void;
}

const EXPERIENCE_ICONS = [
    { icon: Coffee, id: 'Coffee' },
    { icon: Flower, id: 'Flower' },
    { icon: Flower2, id: 'Flower2' },
    { icon: Leaf, id: 'Leaf' },
    { icon: Shrub, id: 'Shrub' },
    { icon: Waves, id: 'Waves' },
    { icon: UtensilsCrossed, id: 'UtensilsCrossed' },
    { icon: Tent, id: 'Tent' },
    { icon: TreePalm, id: 'TreePalm' }
] as const;

const SidebarExperiences: React.FC<SidebarExperiencesProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [activeEstateId, setActiveEstateId] = useState<number | null>(null);
    const [Experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    useEffect(() => {
        const fetchExperiences = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const ExperiencesData = await ExperiencesApi.getExperiences();
                setExperiences(ExperiencesData || []);
            } catch (err) {
                setError('Error al cargar las experiencias');
                console.error('Error fetching Experiences:', err);
                setExperiences([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    const navigateToEstate = (id: number) => {
        setActiveEstateId(id);
        navigate(`/experiencia/${id}`);
        onClose();
    };

    const getIconForExperience = (experienceId: number) => {
        const safeId = Math.abs(experienceId || 0);
        const index = safeId % EXPERIENCE_ICONS.length;
        return EXPERIENCE_ICONS[index] || EXPERIENCE_ICONS[0];
    };

    if (!isOpen) return null;

    const sidebarContent = (
        <aside className={`fixed right-0 z-40 w-64 h-[calc(100vh-${scrolled ? '70px' : '90px'})] transition-all duration-300 bg-white border-r border-gray-200 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ top: scrolled ? '70px' : '90px' }}>
            <div className='p-4 border-b border-gray-200 flex justify-between items-center  '>
                <h2 className="text-lg font-semibold text-gray-800 animate-fade-in-right">
                    Nuestras Experiencias
                </h2>
                <ButtonIcon
                    onClick={onClose}
                    className="!text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-50 "
                    aria-label="Cerrar barra lateral"
                >
                    <X size={20} />
                </ButtonIcon>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <LoadingSpinner message="Cargando experiencias..." />
                </div>
            ) : (
                <nav className="p-4">
                    {error ? (
                        <div className="p-4 text-center text-red-600">
                            <p>{error}</p>
                            <ButtonIcon 
                                onClick={() => {
                                    setError(null);
                                    setExperiences([]);
                                        ExperiencesApi.getExperiences().then(data => setExperiences(data || []));
                                }}
                                className="mt-2 text-sm text-primary hover:underline"
                            >
                                Intentar de nuevo
                            </ButtonIcon>
                        </div>
                    ) : !Array.isArray(Experiences) || Experiences.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                            <p className="text-lg font-medium">No hay experiencias disponibles</p>
                            <p className="text-sm mt-2">Aún no se han registrado experiencias en el sistema</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {Experiences.map((Experience, index) => {
                                const { icon: IconComponent, id: iconId } = getIconForExperience(Number(Experience.id));
                                return (
                                    <li
                                        key={`Experience-${Experience.id}-${iconId}`}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <ButtonIcon
                                            onClick={() => navigateToEstate(Number(Experience.id))}
                                            className={clsx(
                                                '!text-primary w-full flex items-center gap-3 !px-4 !py-3 !text-lg rounded-xl transition-all duration-200',
                                                activeEstateId === Number(Experience.id)  
                                                    ? 'bg-primary text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                                            )}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium truncate">{Experience.name_experience}</span>
                                        </ButtonIcon>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="mt-4">
                        <button
                            className={clsx(
                                'w-full py-3 px-4 rounded-xl',
                                'bg-primary text-white shadow-lg',
                                'transition-all duration-200 hover:bg-primary-hover'
                            )}
                            onClick={() => {
                                navigate('/experiencias');
                                onClose();
                            }}
                        >
                            Ver todas las experiencias
                        </button>
                    </div>
                </nav>
            )}
        </aside>
    );

    return (
        <>
            {sidebarContent}
        </>
    );
};

export default SidebarExperiences;