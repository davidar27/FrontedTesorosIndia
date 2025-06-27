// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@/components/ui/buttons/Button";
import SelectInput from "@/components/ui/inputs/SelectInput";
import DateInput from "@/components/ui/inputs/DateInput";
import { PackagesApi } from "@/services/home/packages";
import Input from "@/components/ui/inputs/Input"

interface Detail {
  detail_id?: number;
  detail?: string;
}

interface Package {
  package_id?: number;
  name?: string;
  description?: string;
  image?: string;
  price?: string;
  capacity?: number;
  details?: Detail[];
}

export default function QuickReservation() {
  const [date, setDate] = useState("");
  const [touched, setTouched] = useState(false);

  const [packages, setPackages] = useState<Package[]>([])
  const [maxPeopleSelected, setMaxPeopleSelected] = useState(0);
  const [people, setPeople] = useState(0);

  useEffect(() => {
    const fecthData = async () => {
      const packagesData: Package[] = await PackagesApi.getPackages()
      setPackages([...packagesData])
      setMaxPeopleSelected(packagesData[0].capacity as any)
    }
    fecthData()
  }, [])

  const handleReservation = () => {
    setTouched(true);
  };

  return (
    <div className="bg-primary rounded-xl shadow-lg overflow-hidden ">
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label>
            Maxima
          </label>
          <Input value={people} onChange={(e: any) => setPeople(e.target.value)}></Input>
          maximo: {maxPeopleSelected}
        </div>

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
          value={packages as any}
          options={packages.map((p: Package) => ({ value: (p.package_id as number), label: (p.name as string) }))}
          onChange={(p: any) => setMaxPeopleSelected(p.capacity)}
        />

        {/* Botón de reserva */}
        <div className="flex items-end">
          <Button
            onClick={handleReservation}
            className="bg-white !text-primary py-3 px-10 rounded-xl  !border-white hover:!bg-primary  hover:!text-white"
            type="submit"
          >
            Reservar ahora
          </Button>
        </div>
      </div>
    </div>
  );
}