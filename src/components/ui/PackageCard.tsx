type PackageCardProps = {
    image?: string;
    title: string;
    description: string;
    onClick: () => void;
    isCreateCard?: boolean;
};

export const PackageCard = ({
    image,
    title,
    description,
    onClick,
    isCreateCard = false,
}: PackageCardProps) => {
    return (
        <div
            className="border rounded-md shadow-sm w-full max-w-xs cursor-pointer hover:shadow-md transition"
            onClick={onClick}
        >
            {isCreateCard ? (
                <div className="flex flex-col items-center justify-center h-64 px-4 py-6 text-center">
                    <span className="text-6xl font-thin">+</span>
                </div>
            ) : (
                <>
                    <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-md" />
                    <div className="p-4">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{description}</p>
                    </div>
                </>
            )}
            <div className="p-4 pt-0">
                <button className="bg-green-600 text-white py-1.5 px-4 rounded hover:bg-green-700 transition">
                    {isCreateCard ? 'Crear paquete' : 'Saber más'}
                </button>
            </div>
        </div>
    );
};
