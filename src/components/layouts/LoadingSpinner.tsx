
const LoadingSpinner = ({ message = "Cargando..." }: { message?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
            <div className="relative">
                <div className="animate-spin h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
                <div className="absolute inset-0 animate-pulse">
                    <div className="h-12 w-12 border-4 border-transparent border-t-primary/40 rounded-full"></div>
                </div>
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
        </div>
    );

}

export default LoadingSpinner;