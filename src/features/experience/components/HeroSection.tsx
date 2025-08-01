import React from 'react';
import {  MapPin } from 'lucide-react';
import { Experience, Review } from '@/features/experience/types/experienceTypes';
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import Input from '@/components/ui/inputs/Input';
import StarRating from '@/features/experience/components/StarRating';
import { calculateAverageRating } from '@/features/experience/utils/rating';

interface HeroSectionProps {
    experience: Experience;
    reviews: Review[];
    isEditMode: boolean;
    editData?: Partial<Experience>;
    onEditDataChange?: (data: Partial<Experience>) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
    experience, 
    reviews, 
    isEditMode, 
    editData, 
    onEditDataChange 
}) => {
    const averageRating = calculateAverageRating(reviews);
    const currentName = editData?.name || experience.name;

    const handleNameChange = (value: string) => {
        console.log('HeroSection: Name changed to:', value); // Debug log
        if (onEditDataChange) {
            onEditDataChange({ ...editData, name: value });
        }
    };

    return (
        <section className="relative h-96 overflow-hidden">
            <div className="absolute inset-0">
                <Picture
                    src={getImageUrl(experience.image)}
                    alt={experience.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex items-end">
                <div className="container pb-16 responsive-padding-x">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {experience.type}
                                </span>
                                <div className="flex items-center gap-1 text-white">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">Colombia</span>
                                </div>
                            </div>
                            {isEditMode ? (
                                <div className='flex items-center gap-2 relative w-fit'>
                                    <Input
                                        value={currentName}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Nombre de la experiencia"
                                        className='bg-transparent text-4xl md:text-5xl font-bold text-white  w-fit border-secondary border-2 truncate'
                                    />
                                </div>
                            ) : (
                                <h1 className="text-4xl md:text-5xl font-bold text-white">
                                    {experience.name}
                                </h1>
                            )}
                            <div className="flex items-center gap-4 text-white">
                                <div className="flex items-center gap-1">
                                    <StarRating rating={Math.round(averageRating)} />
                                    <span className="font-medium ml-1">
                                        {averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-white/80">
                                        ({reviews.length} opiniones)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;