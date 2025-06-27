
import React from 'react';
import { MapPin } from 'lucide-react';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';

interface ExperienceSelectorProps {
    experiences: Experience[];
    selectedExperiences: string[];
    onToggle: (experienceId: string) => void;
    loading?: boolean;
    error?: string;
}

export const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({
    experiences,
    selectedExperiences,
    onToggle,
    loading = false,
    error
}) => {
    return (
        <div className="w-full border-2 border-primary/30 rounded-lg p-4 h-fit">
            <label className="text-sm font-medium text-green-600 mb-2 flex items-center">
                <MapPin className="inline mr-2 h-4 w-4" />
                Experiencias *
            </label>
            <div className="space-y-2">
                {loading ? (
                    <LoadingSpinner message='Cargando experiencias...' />
                ) : (
                    experiences.map((experience) => (
                        <label key={experience.id} className="flex items-center space-x-3 cursor-pointer w-fit transition-all duration-300">
                            <input
                                type="checkbox"
                                checked={selectedExperiences.includes(experience.id?.toString() || '')}
                                onChange={() => onToggle(experience.id?.toString() || '')}
                                className="w-4 h-4 border-2 border-primary/50 rounded-full appearance-none checked:bg-primary checked:border-primary cursor-pointer mr-2"
                                aria-label={`Seleccionar experiencia ${experience.name}`}
                            />
                            <span className="text-gray-700">{experience.name}</span>
                        </label>
                    ))
                )}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};