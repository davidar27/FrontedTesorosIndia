import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Button from "@/components/ui/buttons/Button";
import SelectInput from "@/components/ui/inputs/SelectInput";
import DateInput from "@/components/ui/inputs/DateInput";

interface PackageOption {
  value: string;
  label: string;
  icon: string;
}
export default function QuickReservation() {
  const navigate = useNavigate();
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("Tour");
  const [touched, setTouched] = useState(false);

  const packageOptions: PackageOption[] = useMemo(() => [
    { value: "Tour", label: "Tour", icon: "✈️" },
    { value: "Aventura", label: "Aventura", icon: "🧗‍♂️" },
    { value: "Relajación", label: "Relajación", icon: "🏖️" }
  ], []);

  const peopleOptions = useMemo(() =>
    [1, 2, 3, 4].map(num => ({
      value: num,
      label: `${num} ${num === 1 ? "Adulto" : "Adultos"}`
    })),
    []
  );

  const handleReservation = () => {
    setTouched(true);
    if (!date) return;
    navigate("/reservar", { state: { people, date, packageType } });
  };

  return (
    <div className="bg-primary rounded-xl shadow-lg overflow-hidden ">
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Componente Select reutilizable */}
        <SelectInput
          id="people"
          label="Personas"
          value={people}
          options={peopleOptions}
          onChange={value => setPeople(Number(value))}
        />

        {/* Input de fecha personalizado */}
        <DateInput
          date={date}
          setDate={setDate}
          touched={touched}
        />

        {/* Select de paquetes */}
        <SelectInput
          id="package"
          label="Paquete"
          value={packageType}
          options={packageOptions.map(p => ({ value: p.value, label: `${p.icon} ${p.label}` }))}
          onChange={value => setPackageType(String(value))}
        />

        {/* Botón de reserva */}
        <div className="flex items-end">
          <Button
            onClick={handleReservation}
            className="bg-white !text-primary py-3 px-10 rounded-xl  !border-white hover:!bg-primary  hover:!text-white"
            type="submit"
          >
            Comprar ahora
          </Button>
        </div>
      </div>
    </div>
  );
}

