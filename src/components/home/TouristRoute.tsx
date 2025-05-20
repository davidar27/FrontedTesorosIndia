import Map from '../layouts/Map'



const TouristRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Finca La Esperanza</h1>
      <Map
        locations={[]}
        showUserLocation={true}
      />
    </div>
  );
};

export default TouristRoute