import React from 'react';

export const ErrorState: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        <div className="max-w-md mx-auto pt-32 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-500 text-3xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
                <p className="text-gray-600 mb-6">No pudimos cargar esta experiencia. Por favor, intenta de nuevo.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    Intentar de nuevo
                </button>
            </div>
        </div>
    </div>
);