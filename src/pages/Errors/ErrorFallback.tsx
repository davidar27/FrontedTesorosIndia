const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Algo salió mal
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
                </p>
                <div className="space-y-2">
                    <button
                        onClick={resetErrorBoundary}
                        className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Intentar nuevamente
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Recargar página
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4 text-left">
                        <summary className="cursor-pointer text-sm text-gray-600">
                            Detalles del error (desarrollo)
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}

export default ErrorFallback;