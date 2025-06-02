import Button from '@/components/ui/buttons/Button';

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
    entityNamePlural: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, entityNamePlural }) => (
    <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Error al cargar {entityNamePlural.toLowerCase()}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-4">{error}</p>
        {onRetry && (
            <Button onClick={onRetry} type="button">
                Reintentar
            </Button>
        )}
    </div>
); 