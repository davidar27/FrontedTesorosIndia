import { useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";

const ZoomWithShift = () => {
    const map = useMap();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const container = map.getContainer();

        const handleWheel = (e: WheelEvent) => {
            if (e.shiftKey) {
                e.preventDefault();
                map.scrollWheelZoom.enable();
                setShowTooltip(false);
            } else {
                map.scrollWheelZoom.disable();

                if (!showTooltip) {
                    setShowTooltip(true);

                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        setShowTooltip(false);
                    }, 2500);
                }
            }
        };

        map.scrollWheelZoom.disable();
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [map, showTooltip]);

    if (!showTooltip) return null;

    return (
        <div
            ref={tooltipRef}
            className="leaflet-control-attribution leaflet-control"
            style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                zIndex: 1000,
                pointerEvents: 'none',
                textAlign: 'center',
                boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
                maxWidth: '80%',
                whiteSpace: 'nowrap'
            }}
        >
            <div>Mantén presionado <kbd>Shift</kbd> + usa la rueda del mouse para hacer zoom</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Haz clic en el mapa para interactuar</div>
        </div>
    );
};

export default ZoomWithShift;