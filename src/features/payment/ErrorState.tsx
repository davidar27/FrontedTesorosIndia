import Button from "@/components/ui/buttons/Button";

export const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div className="text-center py-12">
        <p className="text-gray-600">Error al cargar el método de pago</p>
        <Button onClick={onRetry} variant="primary" className="mt-4">
            Reintentar
        </Button>
    </div>
);