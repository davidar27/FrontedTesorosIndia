import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Experience } from '@/features/home/map/types/TouristRouteTypes';

interface MapContextType {
    selectedLocation: Experience | null;
    setSelectedLocation: (location: Experience | null) => void;
    centerOnLocation: (location: Experience) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};

interface MapProviderProps {
    children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState<Experience | null>(null);

    const centerOnLocation = (location: Experience) => {
        setSelectedLocation(location);
    };

    return (
        <MapContext.Provider value={{
            selectedLocation,
            setSelectedLocation,
            centerOnLocation
        }}>
            {children}
        </MapContext.Provider>
    );
}; 