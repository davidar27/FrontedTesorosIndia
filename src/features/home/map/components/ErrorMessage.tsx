import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="responsive-padding-x pt-10">
        <div className="text-center">
            <p className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                {message}
            </p>
        </div>
    </div>
);