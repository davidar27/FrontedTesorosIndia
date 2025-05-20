import Map from '../layouts/Map'
import { Location } from '../layouts/Map';

const fincaLocation: Location[] = [
  {
    id: 1,
    name: "Finca La Esperanza",
    position: { lat: 4.634, lng: -75.687 },
  }
];

const TouristRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Finca La Esperanza</h1>
      <Map
        center={fincaLocation[0].position}
        locations={fincaLocation}
      />
    </div>
  );
};

export default TouristRoute