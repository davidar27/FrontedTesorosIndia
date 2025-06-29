import React, { useEffect } from "react";
import Button from "@/components/ui/buttons/Button";
import SelectInput from "@/components/ui/inputs/SelectInput";
import { PeopleCounter } from "@/features/home/handleFastPackage/components/PeopleCounter";
import { DateSelector } from "@/features/home/handleFastPackage/components/DateSelector";
import { Package, ValidationErrors } from "@/features/home/handleFastPackage/types/handleFastPackageTypes";
import { useParams } from "react-router-dom";

interface PackageFormProps {
    people: number;
    selectedPackageId: number;
    availablePackages: Package[];
    selectedPackage?: Package;
    date: string;
    errors: ValidationErrors;
    isLoading: boolean;
    onPeopleChange: (people: number) => void;
    onPackageChange: (packageId: number) => void;
    onDateChange: (date: string) => void;
    onReservation: () => void;
    getUnavailableDates: () => string[];
}

export const PackageForm: React.FC<PackageFormProps> = ({
    people,
    selectedPackageId,
    availablePackages,
    selectedPackage,
    date,
    errors,
    isLoading,
    onPeopleChange,
    onPackageChange,
    onDateChange,
    onReservation,
    getUnavailableDates
}) => {
    const { packageId } = useParams();

    useEffect(() => {
        if (packageId && Number(packageId) !== selectedPackageId) {
            onPackageChange(Number(packageId));
        }
        // eslint-disable-next-line
    }, [packageId]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 items-center relative">
            {/* Columna 1: Contador de personas */}
            <PeopleCounter
                people={people}
                setPeople={onPeopleChange}
                maxCapacity={selectedPackage?.capacity || 0}
            />

            {/* Columna 2: Selector de paquetes */}

            <SelectInput
                id={selectedPackageId}
                label="Paquete disponible"
                value={selectedPackageId}
                options={availablePackages.map(p => ({
                    value: p.package_id!,
                    label: p.name!
                }))}
                required
                onChange={onPackageChange as (value: number) => void}
                className="h-19"
            />
            {errors.package && (
                <p className="text-red-300 text-xs mt-1">{errors.package}</p>
            )}


            {/* Columna 3: Selector de fecha */}

            <DateSelector
                date={date}
                onDateChange={onDateChange}
                unavailableDates={getUnavailableDates()}
                disabled={!selectedPackageId}
                className="h-26"
            />

            {/* Columna 4: Botón de reserva */}
            <Button
                onClick={onReservation}
                disabled={isLoading || !selectedPackageId || !date || !selectedPackage}
                type="button"
                variant="success"
                className="w-full h-16 !rounded-xl"
            >
                {isLoading ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        Procesando...
                    </>
                ) : (
                    <>
                        🎯 Continuar con la compra
                    </>
                )}
            </Button>
        </div>
    );
};