import React from "react";
import { Experience } from "@/features/admin/experiences/ExperienceTypes";



interface Category {
    id: number;
    name: string;
}
interface FilterState {
    category: string | null;
    experience: string | null;
    priceRange: {
        min: number;
        max: number;
    };
    rating: number | null;
    sortBy: 'name' | 'price' | 'rating';
}

interface Props {
    filters: FilterState;
    categories: Category[];
    experiences: Experience[];
    handleFilterChange: (key: keyof FilterState, value: string | number | null | { min: number; max: number }) => void;
    clearFilters: () => void;
    searchParam: string;
    navigate: (path: string) => void;
}

const FilterSidebarContent: React.FC<Props> = ({
    filters,
    categories,
    experiences,
    handleFilterChange,
    clearFilters,
    searchParam,
    navigate
}) => (
    <>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-green-100">
            <h2 className="text-green-700 font-bold text-xl">Filtros</h2>
            <button
                onClick={() => {
                    clearFilters();
                    if (searchParam) {
                        navigate(`/productos`);
                    }
                }}
                className="text-sm pr-4 md:pr-0 text-green-600 hover:text-green-800 underline"
            >
                Limpiar filtros
            </button>
        </div>

        {/* Categorías */}
        <div className="mb-6">
            <h3 className="text-green-700 font-semibold mb-3">Categorías</h3>
            <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="category"
                        checked={!filters.category}
                        onChange={() => handleFilterChange('category', null)}
                        className="mr-2 text-green-600"
                    />
                    <span className="text-gray-700">Todas las categorías</span>
                </label>
                {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            value={cat.name}
                            checked={filters.category === cat.name}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="mr-2 text-green-600"
                        />
                        <span className="text-gray-700">{cat.name}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Experiencias */}
        <div className="mb-6">
            <h3 className="text-green-700 font-semibold mb-3">Experiencias</h3>
            <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="experience"
                        checked={!filters.experience}
                        onChange={() => handleFilterChange('experience', null)}
                        className="mr-2 text-green-600"
                    />
                    <span className="text-gray-700">Todas las experiencias</span>
                </label>
                {experiences.map((experience) => (
                    <label key={experience.id} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="experience"
                            value={experience.name_experience}
                            checked={filters.experience === experience.name_experience}
                            onChange={(e) => handleFilterChange('experience', e.target.value)}
                            className="mr-2 text-green-600"
                        />
                        <span className="text-gray-700">{experience.name_experience}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Rango de precio */}
        <div className="mb-6">
            <h3 className="text-green-700 font-semibold mb-3">Rango de precio</h3>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Mín"
                        value={filters.priceRange.min}
                        onChange={(e) => handleFilterChange('priceRange', {
                            ...filters.priceRange,
                            min: Number(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Máx"
                        value={filters.priceRange.max}
                        onChange={(e) => handleFilterChange('priceRange', {
                            ...filters.priceRange,
                            max: Number(e.target.value) || 1000000
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>

        {/* Calificación */}
        <div className="mb-6">
            <h3 className="text-green-700 font-semibold mb-3">Calificación mínima</h3>
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={filters.rating === rating}
                            onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                            className="mr-2 text-green-600"
                        />
                        <span className="text-gray-700">
                            {rating}+ estrellas
                        </span>
                    </label>
                ))}
            </div>
        </div>

        {/* Ordenar por */}
        <div className="mb-6">
            <h3 className="text-green-700 font-semibold mb-3">Ordenar por</h3>
            <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="rating">Calificación</option>
            </select>
        </div>
    </>
);

export default FilterSidebarContent;
