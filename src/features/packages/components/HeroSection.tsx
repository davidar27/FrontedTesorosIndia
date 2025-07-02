import React from 'react';
import { MapPin } from 'lucide-react';
import { Review } from '@/features/experience/types/experienceTypes';
import { getImageUrl } from '@/utils/getImageUrl';
import { calculateAverageRating } from '@/features/experience/utils/rating';
import StarRating from '@/features/experience/components/StarRating';
import Picture from '@/components/ui/display/Picture';
import { PackageData } from '@/features/packages/types/packagesTypes';

interface HeroSectionProps {
    packageData: PackageData;
    reviews: Review[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ packageData, reviews }) => {
    const averageRating = calculateAverageRating(reviews);

    return (
        <section className="relative h-96 overflow-hidden">
            <div className="absolute inset-0">
                <Picture
                    src={getImageUrl(packageData.image)}
                    alt={packageData.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex items-end">
                <div className="container pb-16 responsive-padding-x">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1 text-white">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">Colombia</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                {packageData.name}
                            </h1>
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