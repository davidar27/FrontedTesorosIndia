import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export interface Location {
    id: number;
    name: string;
    position: {
        lat: number;
        lng: number;
    };
    description?: string;
}

interface ReusableMapProps {
    locations: Location[];
}

// Fix de íconos de Leaflet en React (sin esto no se ven los marcadores)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Componente para obtener y mostrar ubicación del usuario
const UserLocation = ({ onLocationFound }: { onLocationFound: (latlng: L.LatLng) => void }) => {
    const map = useMap();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const userLatLng = L.latLng(latitude, longitude);
                map.setView(userLatLng, 13);

                L.marker(userLatLng)
                    .addTo(map)
                    .bindPopup('Estás aquí')
                    .openPopup();

                onLocationFound(userLatLng);
            },
            () => {
                console.warn('Ubicación no permitida o disponible');
                onLocationFound(null!); // indica que no hay ubicación
            }
        );
    }, [map, onLocationFound]);

    return null;
};

const Map = ({ locations }: ReusableMapProps) => {
    const [center] = useState({ lat: 4.674, lng: -75.658 });
    const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);

    // Finca destino para la ruta (ejemplo: primer location)
    const destination = locations.length > 0 ? L.latLng(locations[0].position.lat, locations[0].position.lng) : null;

    const RoutingMachine = () => {
        const map = useMap();

        useEffect(() => {
            if (!userLocation || !destination) {
                return;
            }

            const routingControl = L.Routing.control({
                waypoints: [userLocation, destination],
                lineOptions: {
                    styles: [{ color: '#6FA1EC', weight: 5 }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 1,
                },
                addWaypoints: false,
                fitSelectedRoutes: true,
            }).addTo(map);

            return () => {
                map.removeControl(routingControl);
            };
        }, [map, userLocation, destination]);

        return null;
    };

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%', borderRadius: '8px', zIndex: '1' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((loc) => (
                <Marker key={loc.id} position={loc.position}>
                    <Popup>
                        <strong>{loc.name}</strong>
                        <br />
                        {loc.description || ''}
                    </Popup>
                </Marker>
            ))}

            <UserLocation onLocationFound={setUserLocation} />
            {userLocation && destination && <RoutingMachine />}
        </MapContainer>
    );
};

export default Map;
