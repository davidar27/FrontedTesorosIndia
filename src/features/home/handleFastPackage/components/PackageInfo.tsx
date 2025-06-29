import React from "react";
import { Package } from "@/features/home/handleFastPackage/types/handleFastPackageTypes";

interface PackageInfoProps {
    availablePackages: Package[];
    selectedPackage?: Package;
    people: number;
    date: string;
    calculateTotalPrice: () => number;
}

export const PackageInfo: React.FC<PackageInfoProps> = ({
    availablePackages,
    selectedPackage,
    people,
    date,
    calculateTotalPrice
}) => {
    return (
        <div className="pt-4 border-t border-white/20">
            <div className="flex flex-col gap-2 text-white text-sm">
                {/* Información de paquetes disponibles */}
                <div className="flex items-center gap-2 mx-auto">
                    <span>📦</span>
                    <span>
                        <span className="font-bold">{availablePackages.length}</span> paquete{availablePackages.length !== 1 ? 's ' : ' '}
                        disponible{availablePackages.length !== 1 ? 's' : ' '}
                        para {people}
                        {people === 1 ? ' persona' : ' personas'}
                    </span>
                </div>

                {/* Información del paquete seleccionado */}
                {selectedPackage && (
                    <div className="flex items-center justify-center gap-4 text-xs text-white/70">
                        <span>Capacidad: <span className="font-bold">{selectedPackage.capacity}</span> personas</span>
                        <span>Precio: <span className="font-bold">${parseFloat(selectedPackage.price!).toLocaleString()}</span>/persona</span>
                    </div>
                )}

                {/* Resumen de la compra */}
                {selectedPackage && date && (
                    <div className="bg-white/10 rounded-lg p-3 mt-2">
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-300">
                                Total: ${calculateTotalPrice().toLocaleString()}
                            </div>
                            <div className="text-xs text-white/80">
                                Para {people} persona{people !== 1 ? 's' : ''} • {new Date(date).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};