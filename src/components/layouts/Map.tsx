import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export interface Location {
    id: number;
    name: string;
    position: {
        lat: number;
        lng: number;
    };
    description?: string;
    type?: string;
}

interface ReusableMapProps {
    locations: Location[];
}

const ZoomWithShift = () => {
    const map = useMap();
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const container = map.getContainer();

        const handleWheel = (e: WheelEvent) => {
            if (e.shiftKey) {
                map.scrollWheelZoom.enable();
                setShowTooltip(false);
            } else {
                map.scrollWheelZoom.disable();

                if (!showTooltip) {
                    setShowTooltip(true);

                    setTimeout(() => {
                        setShowTooltip(false);
                    }, 2500);
                }
            }
        };

        container.addEventListener('wheel', handleWheel);
        map.scrollWheelZoom.disable();

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [map, showTooltip]);

    return showTooltip ? (
        <div
            ref={tooltipRef}
            style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#333',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                zIndex: 1000,
                pointerEvents: 'none',
            }}
        >
            Usa Shift + rueda del mouse para hacer zoom
        </div>
    ) : null;
};

const ReusableMap = ({ locations }: ReusableMapProps) => {
    const [center] = useState({ lat: 4.674, lng: -75.658 });

    return (
        <div style={{ position: 'relative' }}>
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '500px', width: '100%', borderRadius: '8px' }}
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
                <ZoomWithShift />
            </MapContainer>
        </div>
    );
};

export default ReusableMap;
