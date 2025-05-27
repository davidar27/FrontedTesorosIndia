import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface PageInfo {
    title: string;
    description: string;
}

interface PageContextType {
    pageInfo: PageInfo | null;
    setPageInfo: (info: PageInfo) => void;
    clearPageInfo: () => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pageInfo, setPageInfoState] = useState<PageInfo | null>(null);

    const setPageInfo = useCallback((info: PageInfo) => {
        setPageInfoState(info);
    }, []);

    const clearPageInfo = useCallback(() => {
        setPageInfoState(null);
    }, []);

    const value = {
        pageInfo,
        setPageInfo,
        clearPageInfo
    };

    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
};

export const usePageContext = () => {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
};