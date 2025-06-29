import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/buttons/Button";
import SelectInput from "@/components/ui/inputs/SelectInput";
import DateInput from "@/components/ui/inputs/DateInput";
import { PackagesApi } from "@/services/home/packages";
import { ValidationErrors, Package, ReservationData } from "@/features/home/handleFastPackage/types/handleFastPackageTypes";
import { PeopleCounter } from "@/features/home/handleFastPackage/components/PeopleCounter";


export default function HandleFastPackage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>("");
  const [people, setPeople] = useState<number>(1);
  const [selectedPackageId, setSelectedPackageId] = useState<number>(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesData: Package[] = await PackagesApi.getPackages()
        setPackages([...packagesData])
      } catch (error) {
        console.error('Error fetching packages:', error);
        setErrors({ general: 'Error al cargar los paquetes' });
      }
    };

    fetchPackages();
  }, []);

  const selectedPackage = packages.find(p => p.package_id === selectedPackageId);

  const availablePackages = packages.filter(pkg =>
    pkg.capacity && pkg.capacity >= people
  );

  const validateQuickReservation = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!selectedPackageId) {
      newErrors.package = "Selecciona un paquete";
    }

    if (!date) {
      newErrors.date = "Selecciona una fecha";
    } else if (new Date(date) < new Date()) {
      newErrors.date = "La fecha no puede ser anterior a hoy";
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

  const handlePackageChange = (packageId: number) => {
    setSelectedPackageId(packageId);

    const newPackage = packages.find(p => p.package_id === packageId);
    if (newPackage && people > newPackage.capacity!) {
      setPeople(newPackage.capacity!);
    }

    if (errors.package) {
      setErrors(prev => ({ ...prev, package: "" }));
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);

    if (errors.date) {
      setErrors(prev => ({ ...prev, date: "" }));
    }
  };

  const handlePeopleChange = (newPeople: number) => {
    setPeople(newPeople);

    if (errors.people) {
      setErrors(prev => ({ ...prev, people: "" }));
    }

    if (selectedPackage && newPeople > selectedPackage.capacity!) {
      setSelectedPackageId(0);
    }
  };

  const handleReservation = async () => {
    setTouched(true);

    if (!validateQuickReservation()) return;

    setIsLoading(true);

    try {
      const reservationData: ReservationData = {
        packageId: selectedPackage!.package_id!,
        packageName: selectedPackage!.name!,
        date: date,
        people: people,
        totalPrice: calculateTotalPrice(),
        fromQuickReservation: true,
        timestamp: Date.now()
      };

      const params = new URLSearchParams({
        package: selectedPackage!.package_id!.toString(),
        date: date,
        people: people.toString(),
        quick: 'true'
      });

      navigate(`/checkout/package?${params.toString()}`, {
        state: reservationData
      });

    } catch (error) {
      console.error('Error en reserva rápida:', error);
      setErrors({ general: 'Error al procesar la reserva. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-primary rounded-xl shadow-lg overflow-hidden text-center">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 border-b border-white/50 pb-2">
          <h2 className="text-xl font-bold text-white">
            🚀 Compra Rápida
          </h2>
          <p className="text-white/80 text-sm">
            Selecciona y compra tu paquete perfecto
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Contador de personas */}
          <PeopleCounter
            people={people}
            setPeople={handlePeopleChange}
            maxCapacity={selectedPackage?.capacity || 20}
          />

          {/* Input de fecha */}
          <div className="space-y-1">
            <DateInput
              date={date}
              setDate={handleDateChange}
              touched={touched}
              label="Fecha del viaje"
            />
          </div>

          {/* Select de paquetes filtrados */}
          <div className="space-y-1">
            <SelectInput
              id="package"
              label="Paquete disponible"
              value={selectedPackageId}
              options={availablePackages.map(p => ({
                value: p.package_id!.toString(),
                label: `${p.name} (Máx: ${p.capacity})`
              }))}
              onChange={handlePackageChange as (value: string | number) => void}
            />
          </div>

          {/* Botón de reserva */}
          <div className="flex justify-center items-center">
            <Button
              onClick={handleReservation}
              disabled={isLoading}
              type="button"
              variant="success"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                '🎯 Comprar Ahora'
              )}
            </Button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="pt-4 border-t border-white/20 ">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-2" >
              <span>📦</span>
              <span>
                {availablePackages.length} paquete{availablePackages.length !== 1 ? 's' : ''}
                disponible{availablePackages.length !== 1 ? 's' : ''} para {people}
                {people === 1 ? ' persona' : ' personas'}
              </span>
            </div>
            {selectedPackage && (
              <div className="text-xs text-white/70">
                Capacidad máxima: {selectedPackage.capacity} personas
              </div>
            )}
          </div>
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{errors.general}</span>
            </div>
          </div>
        )}

        {/* Tips de usuario */}
        {!touched && (
          <div className=" bg-white/10 rounded-lg p-3">
            <div className="flex items-start gap-2 text-white/80 text-xs">
              <span>💡</span>
              <div>
                <strong>Tip:</strong> Los paquetes se filtran automáticamente según el número de personas.
                Selecciona primero cuántas personas van a viajar para ver las opciones disponibles.
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}