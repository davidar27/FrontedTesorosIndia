import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagesApi } from "@/services/home/packages";
import { ValidationErrors, Package, ReservationData } from "@/features/home/handleFastPackage/types/handleFastPackageTypes";

export const useHandleFastPackage = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<string>("");
    const [people, setPeople] = useState<number>(1);
    const [selectedPackageId, setSelectedPackageId] = useState<number>(0);
    const [packages, setPackages] = useState<Package[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openCalendar, setOpenCalendar] = useState<boolean>(false);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const packagesData: Package[] = await PackagesApi.getPackages();
                setPackages([...packagesData]);
            } catch (error) {
                console.error('Error fetching packages:', error);
                setErrors({ general: 'Error al cargar los paquetes' });
            }
        };

        fetchPackages();
    }, []);

    const selectedPackage = packages.find(p => p.id == selectedPackageId);
    
    const availablePackages = packages.filter(pkg => pkg.capacity && pkg.capacity >= people);

    // Función para obtener fechas no disponibles del paquete seleccionado
    const getUnavailableDates = (): string[] => {
        if (!selectedPackage?.unavailableDates) return [];

        try {
            const unavailableDates = JSON.parse(selectedPackage.unavailableDates as unknown as string);
            return Array.isArray(unavailableDates) ? unavailableDates : [];
        } catch (error) {
            console.error('Error parsing unavailable dates:', error);
            return [];
        }
    };

    // Función para verificar si una fecha está disponible
    const isDateAvailable = (dateStr: string): boolean => {
        const unavailableDates = getUnavailableDates();
        const [year, month, day] = dateStr.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return !unavailableDates.includes(formattedDate);
    };



    const validateQuickReservation = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!selectedPackageId) {
            newErrors.package = "Selecciona un paquete";
        }
        

        if (!date) {
            newErrors.date = "Selecciona una fecha";
        } else if (new Date(date) < new Date()) {
            newErrors.date = "La fecha no puede ser anterior a hoy";
        } else if (!isDateAvailable(date)) {
            newErrors.date = "Esta fecha no está disponible para el paquete seleccionado";
        }

        if (!people || people < 1) {
            newErrors.people = "Ingresa el número de personas";
        } else if (selectedPackage && people > selectedPackage.capacity!) {
            newErrors.people = `Este paquete permite máximo ${selectedPackage.capacity} personas`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotalPrice = (): number => {
        if (!selectedPackage?.price) return 0;
        const basePrice = parseFloat(selectedPackage.price);
        return basePrice * people;
    };

    const handlePackageChange = (id: number) => {
        setSelectedPackageId(id);
        setDate("");

        const newPackage = packages.find(p => p.id === id);
        if (newPackage && people > newPackage.capacity!) {
            setPeople(newPackage.capacity!);
        }

        if (errors.package || errors.date) {
            setErrors(prev => ({ ...prev, package: "", date: "" }));
        }

        updateUrl(id, "", people);
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        if (errors.date) {
            setErrors(prev => ({ ...prev, date: "" }));
        }

        updateUrl(selectedPackageId, newDate, people);
    };

    const handlePeopleChange = (newPeople: number) => {
        setPeople(newPeople);

        // Si el paquete seleccionado no soporta la nueva cantidad, deselecciónalo
        const pkg = packages.find(p => p.id === selectedPackageId);
        if (pkg && newPeople > pkg.capacity!) {
            setSelectedPackageId(0); // Deselecciona el paquete
            setDate(""); // Opcional: limpia la fecha
        }

        // Actualiza la URL con la nueva cantidad de personas
        updateUrl(selectedPackageId, date, newPeople);
    };

    const handleReservation = async () => {
        if (!validateQuickReservation()) return;

        if (!selectedPackage) {
            setErrors({ general: 'Selecciona un paquete válido antes de reservar.' });
            return;
        }

        setIsLoading(true);

        try {
            const reservationData: ReservationData = {
                id: selectedPackage.id!,
                packageName: selectedPackage.name!,
                date: date,
                people: people,
                totalPrice: calculateTotalPrice(),
                fromQuickReservation: true,
                timestamp: Date.now()
            };

            navigate(`/paquetes/${selectedPackage.id}/comprar?date=${date}&people=${people}`, {
                state: reservationData
            });

        } catch (error) {
            console.error('Error en reserva rápida:', error);
            setErrors({ general: 'Error al procesar la reserva. Intenta de nuevo.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCalendar = () => {
        setOpenCalendar(true);
    };

    const updateUrl = (pkgId: number, date: string, people: number) => {
        const params = new URLSearchParams();
        if (date) params.set("date", date);
        if (people) params.set("people", people.toString());
        const newUrl = `/paquetes/${pkgId}/comprar?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };

    return {
        // Estado
        date,
        people,
        selectedPackageId,
        packages,
        errors,
        isLoading,
        openCalendar,
        selectedPackage,
        availablePackages,

        // Funciones
        getUnavailableDates,
        calculateTotalPrice,
        handlePackageChange,
        handleDateChange,
        handlePeopleChange,
        handleReservation,
        handleOpenCalendar,
        setOpenCalendar
    };
};