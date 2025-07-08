import React from 'react';
import { ResponseParser, ParsedResponse } from '../utils/ResponseParser';
import ResponseCard from './ResponseCard';

interface EnrichedResponseProps {
    response: string;
    className?: string;
}

const EnrichedResponse: React.FC<EnrichedResponseProps> = ({ response, className = '' }) => {
    const parsedResponse: ParsedResponse = ResponseParser.parseResponse(response);

    if (!parsedResponse.hasItems) {
        // Si no hay items, mostrar solo el texto
        return (
            <div className={`text-sm leading-relaxed ${className}`}>
                {parsedResponse.text}
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Texto de la respuesta */}
            {parsedResponse.text && (
                <div className="text-sm leading-relaxed text-gray-800">
                    {parsedResponse.text}
                </div>
            )}

            {/* Cards en columna */}
            {parsedResponse.items.length > 0 && (
                <div className="mt-4 space-y-4">
                    {parsedResponse.items.map((item, index) => (
                        <ResponseCard
                            key={`${item.type}-${item.id}-${index}`}
                            item={item}
                            className="w-full"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrichedResponse; 