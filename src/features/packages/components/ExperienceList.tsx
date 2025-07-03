import { Experience } from "../types/packagesTypes";
import LoadingSpinner from "@/components/ui/display/LoadingSpinner";

interface ExperienceListProps {
    title: string;
    icon: React.ReactNode;
    experiences: Experience[];
    loading: boolean;
    emptyMessage: string;
    itemClassName?: string;
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
    title,
    icon,
    experiences,
    loading,
    emptyMessage,
    itemClassName = "flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
}) => (
    <div className="border-2 border-primary/30 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            {icon}
            {title}
        </h3>
        <div className="space-y-3">
            {loading ? (
                <LoadingSpinner message='Cargando experiencias...' />
            ) : experiences.length > 0 ? (
                experiences.map((experience) => (
                    <div key={experience.experience_id} className={itemClassName}>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 font-medium">{experience.name}</span>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 italic">{emptyMessage}</p>
            )}
        </div>
    </div>
);
