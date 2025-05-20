import { useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries: ('marker')[] = ['marker'];

const mapContainerStyle = {
    width: '100%',
    height: '500px',
};

export interface Location {
    id: number;
    name: string;
    position: {
        lat: number;
        lng: number;
    };
}

interface Props {
    center?: { lat: number; lng: number };
    locations: Location[];
    showUserLocation?: boolean;
}

const GoogleMapWithAdvancedMarkers = ({ center, locations, showUserLocation = false }: Props) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (showUserLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error obteniendo ubicación del usuario:", error);
                }
            );
        }
    }, [showUserLocation]);

    useEffect(() => {
        if (!mapRef.current) return;

        locations.forEach(loc => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current!,
                position: loc.position,
                title: loc.name,
            });

            marker.addEventListener('gmp-click', () => {
                alert(`Has hecho clic en ${loc.name}`);
            });
        });

        if (userLocation) {
            new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current!,
                position: userLocation,
                title: "Tu ubicación",
            });
        }
    }, [locations, userLocation]);

    const mapCenter = userLocation || center || { lat: 4.674, lng: -75.658 };

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            />
        </LoadScript>
    );
};

export default GoogleMapWithAdvancedMarkers;
