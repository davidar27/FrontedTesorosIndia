import LoadingSpinner, { LoadingSpinnerProps } from "@/components/layouts/LoadingSpinner";
import React from "react";


export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = React.useState(initialState);

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);
    const toggleLoading = () => setIsLoading(prev => !prev);

    return {
        isLoading,
        startLoading,
        stopLoading,
        toggleLoading,
        LoadingSpinner: (props: Omit<LoadingSpinnerProps, 'show'>) => (
            <LoadingSpinner {...props} show={isLoading} />
        )
    };
};