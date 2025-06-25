import React, { useMemo } from 'react';
import { Experience } from '../admin/experiences/ExperienceTypes';
import { getExperienceTypeDetails } from '../admin/experiences/experienceUtils';

interface ExperienceItemProps {
    experience: Experience;
    activeEstateId: number | null;
    onNavigate: (id: number) => void;
    index: number;
}

export const ExperienceItem = React.memo<ExperienceItemProps>(
    ({ experience, activeEstateId, onNavigate, index }) => {
        const { Icon: IconComponent, color } = useMemo(() => {
            return getExperienceTypeDetails(experience.type);
        }, [experience.type]);

        const isActive = activeEstateId === Number(experience.id);
        return (
            <li
                className="experience-item-list-item"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <button
                    onClick={() => onNavigate(Number(experience.id))}
                    type="button"
                    title={experience.name_experience}
                    className={`
                        experience-item-button
                        relative w-full text-left rounded-2xl border overflow-hidden
                        cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        transform-gpu
                        ${isActive
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-transparent shadow-xl shadow-green-500/25'
                            : 'bg-white border-gray-200 hover:border-green-300 shadow-sm'
                        }
                    `}
                >
                    {/* Background pattern for active state */}
                    {isActive && (
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full transform -translate-x-10 translate-y-10" />
                        </div>
                    )}

                    <div className="relative p-4">
                        {/* Header with icon and title */}
                        <div className="flex items-center gap-4">
                            <div className={`
                                flex items-center justify-center w-12 h-12 rounded-xl shadow-lg
                                transition-all duration-300 flex-shrink-0
                                ${isActive
                                    ? 'bg-white/20 backdrop-blur-sm'
                                    : `bg-gradient-to-br ${color} shadow-lg`
                                }
                            `}>
                                <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white'}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={`
                                    font-bold text-lg leading-tight
                                    ${isActive ? 'text-white' : 'text-gray-800'}
                                `}>
                                    {experience.name_experience}
                                </h3>
                            </div>
                        </div>
                        {/* Hover indicator */}
                        <div className={`
                            absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 transition-all duration-300
                            ${isActive ? 'opacity-100' : 'group-hover:opacity-100'}
                        `}>
                            <div className={`
                                w-2 h-8 rounded-full
                                ${isActive ? 'bg-white/30' : 'bg-green-500'}
                            `} />
                        </div>
                    </div>
                </button>
            </li>
        );
    }
);

ExperienceItem.displayName = 'ExperienceItem';