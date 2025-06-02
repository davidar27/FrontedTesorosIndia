interface LoadingStateProps {
    entityNamePlural: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ entityNamePlural }) => (
    <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Cargando {entityNamePlural.toLowerCase()}...</p>
    </div>
); 