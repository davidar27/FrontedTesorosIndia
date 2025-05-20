import React from 'react';

interface MapTooltipProps {
    show: boolean;
}

const MapTooltip: React.FC<MapTooltipProps> = ({ show }) => {
    if (!show) return null;

    return (
        <div
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
            ৹ Usa Shift + rueda del mouse para hacer zoom
            <br />
            ৹ Toca para activar el mapa
        </div>
    );
};

export default MapTooltip;
