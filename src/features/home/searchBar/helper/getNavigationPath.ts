import { SearchResult } from "@/services/home/search";

export const getNavigationPath = (result: SearchResult): string => {
    const encodedName = encodeURIComponent(result.name || '');

    switch (result.type) {
        case 'product':
            return `/productos?search=${encodedName}`;
        case 'package':
            return `/productos?type=package&search=${encodedName}`;
        case 'experience':
            return `/experiencias/${result.id}`;
        default:
            return `/productos?search=${encodedName}`;
    }
};