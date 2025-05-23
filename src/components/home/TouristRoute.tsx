import Button from '@/components/ui/buttons/Button';
import { TreePalm, MapPin, Coffee, Mountain } from 'lucide-react';
import ReusableMap from '../layouts/ReusableMap';
import AnimatedTitle from '../ui/AnimatedTitle';

const locations = [
  {
    id: 1,
    name: 'Finca Puerto Arturo',
    position: { lat: 4.6969524975159604, lng: -75.6779047288352 },
    description: 'Correg. La India-Filandia, Filandia, Quindío, Colombia',
    type: 'cafe'
  },
  {
    id: 2,
    name: 'Cañón del Río Barbas',
    position: { lat: 4.681, lng: -75.645 },
    description: 'Reserva natural con diversidad de flora y fauna',
    type: 'naturaleza'
  },
  {
    id: 3,
    name: 'Mirador La India',
    position: { lat: 4.684, lng: -75.668 },
    description: 'Vista panorámica de la región cafetera',
    type: 'mirador'
  },
  {
    id: 4,
    name: 'Sendero Ecológico',
    position: { lat: 4.678, lng: -75.662 },
    description: 'Ruta para caminatas entre bosques nativos',
    type: 'cafe'
  }
];

const TouristRoute = () => {

  return (
    <div className="responsive-padding-x">
      <div className="text-center pb-2">
        <AnimatedTitle
          title='RUTA TURÍSTICA'
          align="center"
          mdAlign="center"
        />
        <p className="text-gray-700 max-w-2xl mx-auto text-lg mt-2">
          ¡Bienvenidos a la vereda La India, una joya escondida en las montañas de Filandia, Quindío!
        </p>
      </div>
      {/* Contenido principal */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Panel lateral */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Puntos de Interés</h2>

            <div className="space-y-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="p-3 rounded-lg hover:bg-green-50 transition cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {location.type === 'cafe' && <Coffee className="text-green-600" />}
                      {location.type === 'naturaleza' && <TreePalm className="text-green-600" />}
                      {location.type === 'mirador' && <MapPin className="text-green-600" />}
                      {location.type === 'caminata' && <Coffee className="text-green-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Actividades</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Tour de Café</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Senderismo</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Avistamiento de Aves</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Fotografía</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
              Reservar Ruta Turística
            </Button>
          </div>
        </div>

        {/* Mapa y descripción */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ReusableMap
              locations={locations}
              initialCenter={{ lat: 4.676, lng: -75.655 }}
              className="border border-gray-200"
            />

          </div>

          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Descubre la Ruta</h2>
            <p className="text-gray-700 mb-4">
              Esta ruta turística es perfecta para los amantes de la naturaleza, el café y la tranquilidad del campo.
              Disfruta de paisajes espectaculares, cultivos de café tradicional y la calidez de la gente local.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <Mountain className="mr-2" /> Naturaleza
                </h3>
                <p className="text-gray-600">
                  Bosques nativos, cañones y ríos cristalinos te esperan en este paraíso natural.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <Coffee className="mr-2" /> Cultura Cafetera
                </h3>
                <p className="text-gray-600">
                  Conoce el proceso tradicional del café de montaña y degusta uno de los mejores cafés del mundo.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Recomendaciones</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Usa calzado cómodo para caminar por los senderos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Lleva protector solar y sombrero</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Reserva con anticipación en temporada alta</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Prueba la gastronomía local en las fincas de la zona</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristRoute;