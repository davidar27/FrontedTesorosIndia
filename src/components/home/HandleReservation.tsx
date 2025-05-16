import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../ui/Button";

export default function QuickReservation() {
  const navigate = useNavigate();
  const [people, setPeople] = useState("2 Adultos");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("Tour");

  const handleReservation = () => {
    navigate("/reservar", {
      state: {
        people,
        date,
        packageType,
      },
    });
  };

  return (
    <div className="bg-primary text-white rounded-md p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col">
        <label className="text-sm">Personas</label>
        <select
          className="text-black rounded-md p-2"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        >
          <option>1 Adulto</option>
          <option>2 Adultos</option>
          <option>3 Adultos</option>
          <option>4 Adultos</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm">Fecha</label>
        <input
          type="date"
          className="text-black rounded-md p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm">Paquete</label>
        <select
          className="text-black rounded-md p-2"
          value={packageType}
          onChange={(e) => setPackageType(e.target.value)}
        >
          <option>Tour</option>
          <option>Aventura</option>
          <option>Relajación</option>
        </select>
      </div>

      <Button
        onClick={handleReservation}
        className="bg-white text-primary font-semibold rounded-md px-6 py-2 hover:bg-hover-primary"
      >
        Reservar ahora
      </Button>
    </div>
  );
}
