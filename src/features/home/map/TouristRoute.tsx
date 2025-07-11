import React, { useCallback } from 'react';
import { useTouristRouteData } from '@/features/home/map/hooks/useTouristRouteData';
import { Experience } from '@/features/home/map/types/TouristRouteTypes';
import { Header } from '@/features/home/map/components/Header';
import { SidePanel } from '@/features/home/map/components/SidePanel';
import { MapSection } from '@/features/home/map/components/MapSection';
import { RouteDescription } from '@/features/home/map/components/RouteDescription';
import { ErrorMessage } from '@/features/home/map/components/ErrorMessage';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { MapProvider } from './context/MapContext';

const TouristRoute: React.FC = () => {
  const { locations, loading, error } = useTouristRouteData();

  const handleLocationClick = useCallback((location: Experience) => {
    // Implementar lógica para centrar el mapa en la ubicación
    console.log('Location clicked:', location);
    // Aquí podrías emitir un evento o usar un contexto para comunicarte con el mapa
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <MapProvider>
      <div className="responsive-padding-x pt-10">
        <Header />

        <div className="grid md:grid-cols-3 gap-8">
          <SidePanel
            locations={locations}
            onLocationClick={handleLocationClick}
          />

          <div className="md:col-span-2">
            <MapSection locations={locations} />
            <RouteDescription locations={locations} />
          </div>
        </div>
      </div>
    </MapProvider>
  );
};

export default TouristRoute;