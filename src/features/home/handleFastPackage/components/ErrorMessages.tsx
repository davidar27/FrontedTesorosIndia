import React from "react";
import { ValidationErrors } from "@/features/home/handleFastPackage/types/handleFastPackageTypes";

interface ErrorMessagesProps {
    errors: ValidationErrors;
}

export const ErrorMessages: React.FC<ErrorMessagesProps> = ({
    errors,

}) => {
    return (
        <>
            {/* Error general */}
            {errors.general && (
                <div className="mt-4 bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errors.general}</span>
                    </div>
                </div>
            )}
        </>
    );
};