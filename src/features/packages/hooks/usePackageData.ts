import { useEffect, useState } from "react";
import { PackageData } from "../types/packagesTypes";
import { PackagesApi } from "@/services/packages/packages";

export const usePackageData = (id?: string) => {
    const [packageData, setPackageData] = useState<PackageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const packageDataResult = await PackagesApi.getPackageById(Number(id));
                setPackageData(packageDataResult as PackageData);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                setError('Error al cargar el paquete');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { packageData, loading, error };
};