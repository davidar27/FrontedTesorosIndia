import { useState, useMemo } from 'react';
import logo from '@/assets/icons/logotesorosindiaPequeño.webp';
import {
    Search,
    Filter,
    User,
    Mountain,
    Plus,
    Package,
    Tag,
    LucideIcon
} from 'lucide-react';
import Picture from '@/components/ui/Picture';
import { DefaultCustomFilters } from './Filter';

// Tipos genéricos
export interface BaseEntity {
    id: number;
    name: string;
    status: 'active' | 'inactive' | 'draft';
}

export interface StatusFilter {
    id: string;
    label: string;
    count: number;
}

export interface SidebarItem {
    id: string;
    label: string;
    icon: LucideIcon;
    active?: boolean;
}

export interface EntityConfig<T extends BaseEntity> {
    // Configuración de la entidad
    entityName: string;
    entityNamePlural: string;
    description: string;
    searchPlaceholder: string;
    emptyStateEmoji: string;
    emptyStateTitle: string;
    emptyStateDescription: string;

    // Datos
    items: T[];

    // Componentes
    ItemCard: React.ComponentType<{
        item: T;
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
        onView: (item: T) => void;
    }>;

    // Callbacks
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    onView: (item: T) => void;
    onCreate: () => void;

    // Filtros personalizados (opcional)
    customFilters?: React.ComponentType<{
        items: T[];
        onFilterChange: (filteredItems: T[]) => void;
    }>;

    // Stats personalizadas (opcional)
    customStats?: Array<{
        label: string;
        value: number | string;
        icon: LucideIcon;
        color?: string;
    }>;

    // Función de búsqueda personalizada (opcional)
    searchFunction?: (item: T, searchTerm: string) => boolean;
}

interface GenericManagementProps<T extends BaseEntity> {
    config: EntityConfig<T>;
    sidebarItems: SidebarItem[];
}

// Función de búsqueda por defecto
const defaultSearchFunction = <T extends BaseEntity>(item: T, searchTerm: string): boolean => {
    const term = searchTerm.toLowerCase();
    return item.name.toLowerCase().includes(term);
};



export default function GenericManagement<T extends BaseEntity>({
    config,
    sidebarItems
}: GenericManagementProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [filteredByCustomFilters, setFilteredByCustomFilters] = useState<T[]>(config.items);

    const searchFunction = config.searchFunction || defaultSearchFunction;
    const CustomFilters = config.customFilters || DefaultCustomFilters;

    const filteredItems = useMemo(() => {
        return filteredByCustomFilters.filter(item =>
            searchFunction(item, searchTerm)
        );
    }, [searchTerm, filteredByCustomFilters, searchFunction]);




    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
            <div className="flex">
                {/* Sidebar */}
                <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 fixed lg:relative z-30 w-64 h-screen`}>
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 animate-fade-in-right">
                            <Picture src={logo} alt="Logo" className="w-10 h-10 object-center object-contain" />
                            <div>
                                <h1 className="font-bold text-gray-800">Tesoros de la India</h1>
                                <p className="text-xs text-gray-500">Sistema de Gestión</p>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4">
                        <ul className="space-y-2">
                            {sidebarItems.map((item, index) => (
                                <li key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                                        ? 'bg-gradient-to-r from-primary to-[#81c9c1] text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                        }`}>
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Mobile menu overlay */}
                {showMobileMenu && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        onClick={() => setShowMobileMenu(false)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 min-h-screen">
                    {/* Header */}
                    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
                        <div className="responsive-padding-x py-4">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <div className="flex items-center gap-4 animate-fade-in-up">
                                    <button
                                        onClick={() => setShowMobileMenu(true)}
                                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
                                    >
                                        <Filter className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-hover-primary bg-clip-text text-transparent">
                                            {config.entityNamePlural}
                                        </h1>
                                        <p className="text-gray-600 mt-1">{config.description}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full lg:w-auto animate-fade-in-right delay-200">
                                    {/* Search */}
                                    <div className="relative flex-1 lg:w-80">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder={config.searchPlaceholder}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                        />
                                    </div>

                                    {/* Add button */}
                                    <button
                                        onClick={config.onCreate}
                                        className="bg-gradient-to-r from-primary to-[#81c9c1] hover:from-hover-primary hover:to-[#6fb4ac] text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Plus className="w-5 h-5" />
                                        {`Nuevo ${config.entityName}`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="responsive-padding-x responsive-padding-y">

                        {/* Custom Filters */}
                        <CustomFilters
                            items={config.items}
                            onFilterChange={setFilteredByCustomFilters}
                        />

                        {/* Results */}
                        <div className="mb-6 animate-fade-in-up delay-200">
                            <p className="text-gray-600">
                                Mostrando {filteredItems.length} de {config.items.length} {config.entityNamePlural.toLowerCase()}
                            </p>
                        </div>

                        {/* Items grid */}
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-16 animate-fade-in-up">
                                <div className="text-6xl mb-4">{config.emptyStateEmoji}</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">{config.emptyStateTitle}</h3>
                                <p className="text-gray-500">{config.emptyStateDescription}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <config.ItemCard
                                            item={item}
                                            onEdit={config.onEdit}
                                            onDelete={config.onDelete}
                                            onView={config.onView}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}


// Items del sidebar predefinidos
export const defaultSidebarItems: SidebarItem[] = [
    { id: 'fincas', label: 'Fincas', icon: Mountain },
    { id: 'paquetes', label: 'Paquetes', icon: Package },
    { id: 'emprendedores', label: 'Emprendedores', icon: User },
    { id: 'categorias', label: 'Categorías', icon: Tag }
];