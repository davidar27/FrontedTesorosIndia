import { useState,useRef, useEffect } from "react";
import { useMap } from "react-leaflet";

const ZoomWithShift = () => {
    const map = useMap();
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [mapInteractive] = useState(false);



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

    return showTooltip && !mapInteractive ? (
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
                whiteSpace: 'nowrap',
            }}
        >
            Usa Shift + rueda del mouse para hacer zoom<br />
            Toca para activar el mapa
        </div>
    ) : null;
}

export default ZoomWithShift;