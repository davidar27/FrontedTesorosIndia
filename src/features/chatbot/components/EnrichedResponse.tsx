import React from 'react';

interface EnrichedResponseProps {
    response: string;
    className?: string;
}

const EnrichedResponse: React.FC<EnrichedResponseProps> = ({ response, className = '' }) => {
    return (
        <div className={`text-sm leading-relaxed ${className}`}>
            {response}
        </div>
    );
};

export default EnrichedResponse; 