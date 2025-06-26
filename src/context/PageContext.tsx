import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

interface PageInfo {
    title: string;
    description: string;
}

interface PageContextType {
    pageInfo: PageInfo | null;
    setPageInfo: (info: PageInfo) => void;
    clearPageInfo: () => void;
    searchValue: string | null;
    setSearchPageValue: (search: string) => void;
    isEditMode: boolean;
    setIsEditMode: (mode: boolean) => void;
    toggleEditMode: () => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pageInfo, setPageInfoState] = useState<PageInfo | null>(null);
    const [searchValue, setterSearchValue] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchParams, setSearchValue] = useSearchParams();


    const setSearchPageValue = useCallback((search: string) => {
        setterSearchValue(search);
    }, []);

    const setPageInfo = useCallback((info: PageInfo) => {
        setPageInfoState(info);
    }, []);

    const clearPageInfo = useCallback(() => {
        setPageInfoState(null);
    }, []);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    useEffect(() => {
        if (!searchParams.get("search")) {
            setSearchValue("");
            setSearchPageValue("");
        }
    }, [searchParams, setSearchPageValue, setSearchValue]);

    const value = {
        pageInfo,
        setPageInfo,
        clearPageInfo,
        searchValue,
        setSearchPageValue,
        isEditMode,
        setIsEditMode,
        toggleEditMode
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