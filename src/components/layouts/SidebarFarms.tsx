import React, { useState, useEffect } from 'react';
import { Coffee, X, Flower, Flower2, Leaf, Shrub, Waves, UtensilsCrossed, Tent, TreePalm } from 'lucide-react';
import { Farm } from '@/features/admin/farms/FarmTypes';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { farmsApi } from '@/services/admin/farms';
import clsx from 'clsx';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import ButtonIcon from '../ui/buttons/ButtonIcon';

interface SidebarFarmsProps {
    isOpen: boolean;
    onClose: () => void;
}

const FARM_ICONS = [
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

const SidebarFarms: React.FC<SidebarFarmsProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [activeEstateId, setActiveEstateId] = useState<number | null>(null);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    useEffect(() => {
        const fetchFarms = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const farmsData = await farmsApi.public.getFarms();
                setFarms(farmsData || []);
            } catch (err) {
                setError('Error al cargar las fincas');
                console.error('Error fetching farms:', err);
                setFarms([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFarms();
    }, []);

    const navigateToEstate = (id: number) => {
        setActiveEstateId(id);
        navigate(`/finca/${id}`);
        onClose();
    };

    const getIconForFarm = (farmId: number) => {
        const safeId = Math.abs(farmId || 0);
        const index = safeId % FARM_ICONS.length;
        return FARM_ICONS[index] || FARM_ICONS[0];
    };

    if (!isOpen) return null;

    const sidebarContent = (
        <aside className={`fixed right-0 z-40 w-64 h-[calc(100vh-${scrolled ? '70px' : '90px'})] transition-all duration-300 bg-white border-r border-gray-200 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ top: scrolled ? '70px' : '90px' }}>
            <div className='p-4 border-b border-gray-200 flex justify-between items-center  '>
                <h2 className="text-lg font-semibold text-gray-800 animate-fade-in-right">
                    Nuestras Fincas
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
                    <LoadingSpinner message="Cargando fincas..." />
                </div>
            ) : (
                <nav className="p-4">
                    {error ? (
                        <div className="p-4 text-center text-red-600">
                            <p>{error}</p>
                            <ButtonIcon 
                                onClick={() => {
                                    setError(null);
                                    setFarms([]);
                                    farmsApi.public.getFarms().then(data => setFarms(data || []));
                                }}
                                className="mt-2 text-sm text-primary hover:underline"
                            >
                                Intentar de nuevo
                            </ButtonIcon>
                        </div>
                    ) : !Array.isArray(farms) || farms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                            <p className="text-lg font-medium">No hay fincas disponibles</p>
                            <p className="text-sm mt-2">Aún no se han registrado fincas en el sistema</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {farms.map((farm, index) => {
                                const { icon: IconComponent, id: iconId } = getIconForFarm(Number(farm.id));
                                return (
                                    <li
                                        key={`farm-${farm.id}-${iconId}`}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <ButtonIcon
                                            onClick={() => navigateToEstate(Number(farm.id))}
                                            className={clsx(
                                                '!text-primary w-full flex items-center gap-3 !px-4 !py-3 !text-lg rounded-xl transition-all duration-200',
                                                activeEstateId === Number(farm.id)  
                                                    ? 'bg-primary text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                                            )}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium truncate">{farm.name}</span>
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
                                navigate('/fincas');
                                onClose();
                            }}
                        >
                            Ver todas las fincas
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

export default SidebarFarms;