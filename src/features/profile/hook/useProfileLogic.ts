import { useMutation } from "@tanstack/react-query";
import { UserProfile } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ProfileApi } from "@/services/user/profile";




export const useProfileLogic = () => {
    const { user, updateUser } = useAuth();
    const queryClient = useQueryClient();
    
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    // Mutation para actualizar perfil
    const profileUpdateMutation = useMutation({
        mutationFn: (formData: FormData) => {
            if (!user) throw new Error("User not found");
            return ProfileApi.updateProfile(user.id, formData);
        },
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            setProfile(updatedUser);
            setIsEditing(false);
            resetImageState();
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
        onError: (error) => {
            console.error('Error al guardar el perfil:', error);
        }
    });

    // Funciones auxiliares
    const resetImageState = () => {
        setImageFile(null);
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setEditedProfile(prev => ({
            ...(prev as UserProfile),
            [field]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setImageFile(file);
        }
    };

    const handleSave = () => {
        if (!editedProfile || !user) return;

        const formData = new FormData();
        formData.append('name', editedProfile.name);
        formData.append('email', editedProfile.email);
        
        if (editedProfile.phone) formData.append('phone', editedProfile.phone);
        if (editedProfile.address) formData.append('address', editedProfile.address);
        if (imageFile) formData.append('image', imageFile);

        if (editedProfile.password) {
            console.warn("La actualización de la contraseña debe realizarse a través de un flujo seguro y no se incluye aquí.");
        }

        profileUpdateMutation.mutate(formData);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
        resetImageState();
    };

    const startEditing = () => setIsEditing(true);

    // Efectos
    useEffect(() => {
        if (user) {
            setIsProfileLoading(true);
            ProfileApi.getProfile(user.id)
                .then(profileData => {
                    const profileWithPassword = { ...profileData, password: '' };
                    setProfile(profileWithPassword);
                    setEditedProfile(profileWithPassword);
                })
                .finally(() => setIsProfileLoading(false));
        } else {
            setIsProfileLoading(false);
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    return {
        user,
        profile,
        editedProfile,
        isEditing,
        previewImage,
        isProfileLoading,
        profileUpdateMutation,
        handleInputChange,
        handleImageChange,
        handleSave,
        handleCancel,
        startEditing
    };
};
