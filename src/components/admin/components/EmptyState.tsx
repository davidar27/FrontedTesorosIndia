import Button from '@/components/ui/buttons/Button';

interface EmptyStateProps {
    emoji: string;
    title: string;
    description: string;
    searchTerm?: string;
    onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    emoji,
    title,
    description,
    searchTerm,
    onClearSearch
}) => (
    <div className="text-center py-16">
        <div className="text-6xl mb-4" role="img" aria-label={emoji}>
            {emoji}
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {title}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-4">
            {description}
        </p>
        {searchTerm && onClearSearch && (
            <Button onClick={onClearSearch} type="button">
                Limpiar búsqueda
            </Button>
        )}
    </div>
); 