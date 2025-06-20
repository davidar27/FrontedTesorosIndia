import { useMemo } from 'react';
import useAuth from '@/context/useAuth';
import { useParams } from 'react-router-dom';

interface ExperiencePermissions {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageMembers: boolean;
    canManageProducts: boolean;
    isOwner: boolean;
    isAdmin: boolean;
    isEntrepreneur: boolean;
}

export const useExperiencePermissions = (): ExperiencePermissions => {
    const { user, isAdmin, isEntrepreneur } = useAuth();
    const { experience_id } = useParams();

    return useMemo(() => {
        const isOwner = isEntrepreneur && user?.experience_id === Number(experience_id);        
        
        const canView = true; 
        const canEdit = isOwner || isAdmin;
        const canDelete = isOwner || isAdmin;
        const canManageMembers = isOwner || isAdmin;
        const canManageProducts = isOwner || isAdmin;

        return {
            canView,
            canEdit,
            canDelete,
            canManageMembers,
            canManageProducts,
            isOwner,
            isAdmin: isAdmin || false,
            isEntrepreneur: isEntrepreneur || false
        };
    }, [user, isAdmin, isEntrepreneur, experience_id]);
};

export default useExperiencePermissions; 