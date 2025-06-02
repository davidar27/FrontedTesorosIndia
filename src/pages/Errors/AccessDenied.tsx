import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AccessDenied = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        Acceso Denegado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        No tienes permisos para acceder a esta página.
                    </p>
                    <div className="space-y-4">
                        {isAuthenticated ? (
                            <>
                                <p className="text-sm text-gray-500">
                                    Vuelve a la página principal o contacta al administrador si crees que esto es un error.
                                </p>
                                <Link
                                    to="/"
                                    className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Ir al Inicio
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">
                                    Inicia sesión para acceder a esta página.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied; 