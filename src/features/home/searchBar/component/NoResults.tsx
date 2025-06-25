export const NoResults: React.FC<{ searchValue: string }> = ({ searchValue }) => (
    <div className="px-4 py-3 text-gray-500 text-center">
        No se encontraron resultados para "{searchValue}"
    </div>
);
