import React, { useState, useEffect, useCallback } from 'react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion';
import ButtonIcon from '../../components/ui/buttons/ButtonIcon';
import { ExperiencesApi } from '@/services/home/experiences';
import { ExperienceItem } from './ExperienceItem';
import { X, RefreshCw, Sparkles } from 'lucide-react';

interface SidebarExperiencesProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidebarExperiences: React.FC<SidebarExperiencesProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [activeEstateId, setActiveEstateId] = useState<number | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const fetchExperiences = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const experiencesData = await ExperiencesApi.getExperiences();
            const experiencesArray = experiencesData || [];
            setExperiences(experiencesArray);
            setFilteredExperiences(experiencesArray);
        } catch (err) {
            setError('Error al cargar las experiencias');
            console.error('Error fetching Experiences:', err);
            setExperiences([]);
            setFilteredExperiences([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Filtrar experiencias basado en la búsqueda
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredExperiences(experiences);
        } else {
            const filtered = experiences.filter(experience =>
                experience.name_experience.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredExperiences(filtered);
        }
    }, [searchTerm, experiences]);

    useEffect(() => {
        if (isOpen) {
            fetchExperiences();
        }
    }, [isOpen, fetchExperiences]);

    const navigateToEstate = useCallback((experience_id: number) => {
        setActiveEstateId(experience_id);
        navigate(`/experiencias/${experience_id}`);
        onClose();
    }, [navigate, onClose]);

    const handleRetry = useCallback(async () => {
        setError(null);
        setExperiences([]);
        setFilteredExperiences([]);
        await fetchExperiences();
    }, [fetchExperiences]);

    if (!isOpen) return null;

    const sidebarVariants = {
        hidden: {
            x: '100%',
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    />

                    {/* Sidebar */}
                    <motion.aside
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={clsx(
                            'fixed right-0 z-40 w-80 lg:w-96 h-full transition-all duration-300',
                            'bg-gradient-to-br from-white via-white to-green-50/30',
                            'border-l border-green-100 shadow-2xl shadow-green-900/10'
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
                                    onClick={onClose}
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
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-64 px-6"
                                >
                                    <LoadingSpinner message="Cargando experiencias..." />
                                </motion.div>
                            ) : (
                                <nav className="p-6">
                                    {error ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
                                        >
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                                <X className="w-6 h-6 text-red-600" />
                                            </div>
                                            <p className="text-red-700 font-medium">{error}</p>
                                            <button
                                                onClick={handleRetry}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg
                                                         hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                                            >
                                                <RefreshCw size={16} />
                                                Intentar de nuevo
                                            </button>
                                        </motion.div>
                                    ) : !Array.isArray(filteredExperiences) || filteredExperiences.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center justify-center h-64 text-center"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-semibold text-gray-600">
                                                {searchTerm ? 'No se encontraron experiencias' : 'No hay experiencias disponibles'}
                                            </p>
                                            <p className="text-sm text-gray-500 max-w-xs">
                                                {searchTerm
                                                    ? 'Intenta con otros términos de búsqueda'
                                                    : 'Aún no se han registrado experiencias en el sistema'
                                                }
                                            </p>
                                            {searchTerm && (
                                                <button
                                                    onClick={() => setSearchTerm('')}
                                                    className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium"
                                                >
                                                    Limpiar búsqueda
                                                </button>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">
                                                    {filteredExperiences.length} experiencia{filteredExperiences.length !== 1 ? 's' : ''}
                                                    {searchTerm && ' encontrada' + (filteredExperiences.length !== 1 ? 's' : '')}
                                                </p>
                                            </div>
                                            <ul className="space-y-3">
                                                {filteredExperiences.map((experience, index) => (
                                                    <motion.div
                                                        key={`experience-${experience.id}-${index}`}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <ExperienceItem
                                                            experience={experience}
                                                            activeEstateId={activeEstateId}
                                                            onNavigate={navigateToEstate}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </nav>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default React.memo(SidebarExperiences);