import React, { useState, useEffect, useCallback } from 'react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import ButtonIcon from '../../components/ui/buttons/ButtonIcon';
import { ExperiencesApi } from '@/services/home/experiences';
import Button from '../../components/ui/buttons/Button';
import { ExperienceItem } from './ExperienceItem';
import { X } from 'lucide-react';

interface SidebarExperiencesProps {
    isOpen: boolean;
    onClose: () => void;
}


const SidebarExperiences: React.FC<SidebarExperiencesProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [activeEstateId, setActiveEstateId] = useState<number | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const fetchExperiences = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const experiencesData = await ExperiencesApi.getExperiences();
            setExperiences(experiencesData || []);
        } catch (err) {
            setError('Error al cargar las experiencias');
            console.error('Error fetching Experiences:', err);
            setExperiences([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchExperiences();
        }
    }, [isOpen, fetchExperiences]);

    const navigateToEstate = useCallback((id: number) => {
        setActiveEstateId(id);
        navigate(`/experiencia/${id}`);
        onClose();
    }, [navigate, onClose]);

    const handleRetry = useCallback(async () => {
        setError(null);
        setExperiences([]);
        const data = await ExperiencesApi.getExperiences();
        setExperiences(data || []);
    }, []);

    const handleViewAll = useCallback(() => {
        navigate('/experiencias');
        onClose();
    }, [navigate, onClose]);

    if (!isOpen) return null;

    const sidebarContent = (
        <aside 
            className={clsx(
                'fixed right-0 z-40 w-64 h-[calc(100vh-${scrolled ? "70px" : "90px"})]',
                'animate-fade-in-right transition-all duration-300 bg-white border-r border-gray-200',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )} 
            style={{ top: scrolled ? '70px' : '90px' }}
        >
            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
                <h2 className="text-lg font-semibold text-gray-800">
                    Nuestras Experiencias
                </h2>
                <ButtonIcon
                    onClick={onClose}
                    className='!text-gray-500'
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
                                onClick={handleRetry}
                            >
                                Intentar de nuevo
                            </ButtonIcon>
                        </div>
                    ) : !Array.isArray(experiences) || experiences.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                            <p className="text-lg font-medium">No hay experiencias disponibles</p>
                            <p className="text-sm mt-2">Aún no se han registrado experiencias en el sistema</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {experiences.map((experience, index) => (
                                <ExperienceItem
                                    key={`experience-${experience.id}-${index}`}
                                    experience={experience}
                                    activeEstateId={activeEstateId}
                                    onNavigate={navigateToEstate}
                                />
                            ))}
                        </ul>
                    )}

                    <div className="mt-4">
                        <Button
                            variant='primary'
                            fullWidth
                            onClick={handleViewAll}
                        >
                            Ver todas las experiencias
                        </Button>
                    </div>
                </nav>
            )}
        </aside>
    );

    return sidebarContent;
};

export default React.memo(SidebarExperiences);