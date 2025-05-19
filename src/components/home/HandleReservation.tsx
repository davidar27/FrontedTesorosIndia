import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../ui/Button";

export default function QuickReservation() {
  const navigate = useNavigate();
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("Tour");

  const handleReservation = () => {
    if (!date) {
      alert("Por favor selecciona una fecha.");
      return;
    }
    navigate("/reservar", {
      state: {
        people,
        date,
        packageType,
      },
    });
  };

  return (
    <div className="bg-primary text-white rounded-md p-4
      flex flex-col gap-4
      sm:flex-row sm:items-center sm:justify-between sm:gap-4
      md:gap-6
      lg:gap-8
      xl:gap-10
    ">
      <div className="flex flex-col">
        <label htmlFor="people" className="text-sm mb-1">
          Personas
        </label>
        <select
          id="people"
          className="rounded-md p-2"
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
        >
          <option value={1}>1 Adulto</option>
          <option value={2}>2 Adultos</option>
          <option value={3}>3 Adultos</option>
          <option value={4}>4 Adultos</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="date" className="text-sm mb-1">
          Fecha
        </label>
        <input
          id="date"
          type="date"
          className="rounded-md p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="package" className="text-sm mb-1">
          Paquete
        </label>
        <select
          id="package"
          className="rounded-md p-2"
          value={packageType}
          onChange={(e) => setPackageType(e.target.value)}
        >
          <option value="Tour">Tour</option>
          <option value="Aventura">Aventura</option>
          <option value="Relajación">Relajación</option>
        </select>
      </div>

      <Button
        onClick={handleReservation}
        className="bg-white !text-primary"
      >
        Reservar ahora
      </Button>
    </div>
  );
}
