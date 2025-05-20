import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapTooltip from '@/components/ui/MapTooltip';
import { handleMouseEnter, handleMouseLeave } from '@/hooks/mapHandlers';
import 'leaflet/dist/leaflet.css';

const ReusableMap: React.FC = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <div
            className="mapWrapper"
            onMouseEnter={() => handleMouseEnter(setShowTooltip, timeoutRef)}
            onMouseLeave={() => handleMouseLeave(setShowTooltip, timeoutRef)}
            style={{ position: 'relative', height: '400px', width: '100%' }}
        >
            <MapContainer
                center={{ lat: 40.4168, lng: -3.7038 }}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
            </MapContainer>

            <MapTooltip show={showTooltip} />
        </div>
    );
};

export default ReusableMap;
