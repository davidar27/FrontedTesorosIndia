import Map from '../layouts/Map'
import { Location } from '../layouts/Map';
const locations: Location[] = [
  {
    id: 1,
    name: 'Finca Puerto Arturo',
    position: { lat:  4.6969524975159604, lng: -75.6779047288352 },
    description: 'Correg. La India-Filandia, Filandia, Quindío, Colombia',
  },
];



const TouristRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ruta Turistica</h1>
      <p>¡Bienvenidos a la vereda La India, una joya escondida en las montañas de Filandia, Quindío! Esta ruta turística es perfecta para los amantes de la naturaleza, el café y la tranquilidad del campo.</p>
      <Map
        locations={locations}
      />

    </div>
  );
};

export default TouristRoute