import { Coffee, Flower, Flower2, Leaf, Shrub, Waves, UtensilsCrossed, Tent, TreePalm } from 'lucide-react';
import React, { useMemo } from 'react';
import { Experience } from '../admin/experiences/ExperienceTypes';
import ButtonIcon from '../../components/ui/buttons/ButtonIcon';
import clsx from 'clsx';




const EXPERIENCE_ICONS = [
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

export const ExperienceItem = React.memo(({
    experience,
    activeEstateId,
    onNavigate
}: {
    experience: Experience;
    activeEstateId: number | null;
    onNavigate: (id: number) => void;
}) => {
    const { icon: IconComponent } = useMemo(() => {
        const safeId = Math.abs(Number(experience.id) || 0);
        const index = safeId % EXPERIENCE_ICONS.length;
        return EXPERIENCE_ICONS[index] || EXPERIENCE_ICONS[0];
    }, [experience.id]);

    return (
        <li
            className="animate-fade-in-up"
        >
            <ButtonIcon
                onClick={() => onNavigate(Number(experience.id))}
                className={clsx(
                    '!text-primary w-full flex items-center gap-3 !px-4 !py-3 !text-lg  transition-all duration-200 hover:!bg-gray-100 hover:text-primary',
                    activeEstateId === Number(experience.id)
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                )}
            >
                <IconComponent className="w-5 h-5 text-gray-500 " />
                <span className="font-medium truncate">{experience.name_experience}</span>
            </ButtonIcon>
        </li>
    );
});

ExperienceItem.displayName = 'ExperienceItem';