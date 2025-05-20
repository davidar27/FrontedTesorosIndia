import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position: [number, number] = [4.674, -75.658];

const MapWithStadia = () => {
  return (
    <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Esta es una finca registrada.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWithStadia;
