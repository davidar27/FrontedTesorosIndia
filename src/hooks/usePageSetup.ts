import { useEffect } from 'react';
import { usePageContext } from '@/context/PageContext';


interface UsePageSetupProps {
    title: string;
    description: string;
}

export const usePageSetup = ({ title, description, }: UsePageSetupProps) => {
    const { setPageInfo, clearPageInfo } = usePageContext();

    useEffect(() => {
        setPageInfo({
            title,
            description
        });

        // Cleanup cuando el componente se desmonta
        return () => clearPageInfo();
    }, [title, description]);
};