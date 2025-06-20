import React, { useState, useCallback, useMemo, useEffect } from 'react';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import ButtonIcon from '../../components/ui/buttons/ButtonIcon';
import { ExperiencesApi } from '@/services/home/experiences';
import { ExperienceItem } from './ExperienceItem';
import { X, RefreshCw, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';

interface SidebarExperiencesProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarExperiences: React.FC<SidebarExperiencesProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    
    const [isRendered, setIsRendered] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const activeExperienceId = useMemo(() => {
        const match = location.pathname.match(/\/experiencias\/(\d+)/);
        return match ? Number(match[1]) : null;
    }, [location.pathname]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setIsClosing(false);
        } else {
            setIsClosing(true);
        }
    }, [isOpen]);

    const { 
        data: experiences = [],
        isLoading, 
        error,
        refetch
    } = useQuery<Experience[]>({
        queryKey: ['experiences'],
        queryFn: ExperiencesApi.getExperiences,
        staleTime: 5 * 60 * 1000,
        enabled: isRendered, // Cargar datos solo cuando el sidebar es visible o está apareciendo
    });

    const handleAnimationEnd = () => {
        if (isClosing) {
            setIsRendered(false);
        }
    };
    
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const navigateToEstate = useCallback((experience_id: number) => {
        navigate(`/experiencias/${experience_id}`);
        handleClose();
    }, [navigate, handleClose]);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    if (!isRendered) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={clsx(
                    "fixed inset-0 bg-black/20 z-30 lg:hidden",
                    !isClosing ? 'animate-fade-in' : 'animate-fade-out'
                )}
                style={{ animationDuration: '300ms' }}
            />

            {/* Sidebar */}
            <aside
                onAnimationEnd={handleAnimationEnd}
                className={clsx(
                    'fixed right-0 z-40 w-80 lg:w-96 h-full transition-all duration-300',
                    'bg-gradient-to-br from-white via-white to-green-50/30',
                    'border-l border-green-100 shadow-2xl shadow-green-900/10',
                    !isClosing ? 'animate-fade-in-right' : 'animate-slide-out-right'
                )}
                style={{
                    top: scrolled ? '70px' : '90px',
                    height: `calc(100vh - ${scrolled ? '70px' : '90px'})`
                }}
            >
                {/* Header */}
                <div className='relative p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50'>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Experiencias
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Descubre nuevas aventuras
                                </p>
                            </div>
                        </div>
                        <ButtonIcon
                            onClick={handleClose}
                            className='!text-gray-500 hover:!text-gray-700 hover:bg-white/50 transition-all duration-200'
                            aria-label="Cerrar barra lateral"
                            type='button'
                        >
                            <X size={30} />
                        </ButtonIcon>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 px-6">
                            <LoadingSpinner message="Cargando experiencias..." />
                        </div>
                    ) : (
                        <nav className="p-6">
                            {error ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-scale-in">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                        <X className="w-6 h-6 text-red-600" />
                                    </div>
                                    <p className="text-red-700 font-medium">Error al cargar experiencias</p>
                                    <button
                                        onClick={handleRetry}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg
                                                 hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                                    >
                                        <RefreshCw size={16} />
                                        Intentar de nuevo
                                    </button>
                                </div>
                            ) : !Array.isArray(experiences) || experiences.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-600">
                                        No hay experiencias disponibles
                                    </p>
                                    <p className="text-sm text-gray-500 max-w-xs">
                                        Aún no se han registrado experiencias en el sistema
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            {experiences.length} experiencia{experiences.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <ul className="space-y-3 mt-4">
                                        {experiences.map((experience, index) => (
                                            <ExperienceItem
                                                key={`experience-${experience.id}`}
                                                index={index}
                                                experience={experience}
                                                activeEstateId={activeExperienceId}
                                                onNavigate={navigateToEstate}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </nav>
                    )}
                </div>
            </aside>
        </>
    );
};

export default React.memo(SidebarExperiences);