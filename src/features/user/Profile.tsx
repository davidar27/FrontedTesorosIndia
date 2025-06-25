import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, MapPin, Phone, Mail, User as UserIcon, Camera } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/context/useAuth';
import { ProfileApi } from '@/services/user/profile';
import Avatar from '@/components/ui/display/Avatar';
import { getImageUrl } from '@/utils/getImageUrl';
import Button from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/layouts/LoadingSpinner';

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password?: string;
    image?: string;
}

const Profile: React.FC = () => {
    const { user, isLoading, updateUser } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const profileUpdateMutation = useMutation({
        mutationFn: (formData: FormData) => {
            if (!user) throw new Error("User not found");
            return ProfileApi.updateProfile(user.id, formData);
        },
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            setProfile(updatedUser);
            setIsEditing(false);
            setImageFile(null);
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
                setPreviewImage(null);
            }
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
        onError: (error) => {
            console.error('Error al guardar el perfil:', error);
        }
    });

    useEffect(() => {
        if (user) {
            ProfileApi.getProfile(user.id).then(profileData => {
                setProfile({ ...profileData, password: '' });
                setEditedProfile({ ...profileData, password: '' });
            });
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

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
        if (editedProfile && user) {
            const formData = new FormData();
            formData.append('name', editedProfile.name);
            formData.append('email', editedProfile.email);
            if (editedProfile.phone) formData.append('phone', editedProfile.phone);
            if (editedProfile.address) formData.append('address', editedProfile.address);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editedProfile.password) {
                console.warn("La actualización de la contraseña debe realizarse a través de un flujo seguro y no se incluye aquí.");
            }

            profileUpdateMutation.mutate(formData);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
        setImageFile(null);
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
    };

    if (isLoading) {
        return (
            <LoadingSpinner message='Cargando tu perfil...' />
        );
    }

    if (!user || !profile) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Perfil no disponible</h2>
                    <p className="text-gray-500">Por favor, inicia sesión para ver tu perfil.</p>
                    <Button
                        onClick={() => window.location.href = '/auth/iniciar-sesion'}
                        className="mt-6"
                    >
                        Ir a Iniciar Sesión
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
            {/* Header Hero Section */}
            <div className="relative pt-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Mi Perfil
                        </h1>
                        <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                            Gestiona tu información personal y descubre los tesoros que Colombia tiene para ofrecerte
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="relative -mt-8 z-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative group">
                                    <Avatar
                                        className="border-4 border-white shadow-xl"
                                        src={previewImage || getImageUrl(profile.image || '')}
                                        name={profile.name}
                                        size={124}
                                    />
                                    {isEditing && (
                                        <label
                                            htmlFor="image-input"
                                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <Camera className="w-8 h-8" />
                                            <input
                                                id="image-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="text-center md:text-left text-white">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h2>
                                    <p className="text-emerald-100 text-lg mb-4">Explorador de Tesoros</p>
                                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-2 text-emerald-100">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{profile.email}</span>
                                        </div>
                                        {profile.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-sm">{profile.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="grid gap-8">
                                {/* Information Cards */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name Card */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                                <UserIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Nombre Completo</h3>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedProfile?.name || ''}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                placeholder="Tu nombre completo"
                                            />
                                        ) : (
                                            <p className="text-gray-700 text-lg">{profile.name}</p>
                                        )}
                                    </div>

                                    {/* Email Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Correo Electrónico</h3>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedProfile?.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="tu@email.com"
                                            />
                                        ) : (
                                            <p className="text-gray-700 text-lg">{profile.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Card */}
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Teléfono</h3>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedProfile?.phone || ''}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                placeholder="Número de teléfono"
                                            />
                                        ) : (
                                            <p className="text-gray-700 text-lg">{profile.phone || 'No especificado'}</p>
                                        )}
                                    </div>

                                    {/* Address Card */}
                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Dirección</h3>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedProfile?.address || ''}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                                placeholder="Tu dirección"
                                            />
                                        ) : (
                                            <p className="text-gray-700 text-lg">{profile.address || 'Sin dirección especificada'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center pt-8 border-t border-gray-100">
                                    {!isEditing ? (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant='secondary'
                                            className='px-8 py-2'
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>Editar Perfil</span>
                                            </div>
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                            <Button
                                                onClick={handleCancel}
                                                disabled={profileUpdateMutation.isPending}
                                                variant='danger'
                                                className='px-8 py-2'
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                                    <span>Cancelar</span>
                                                </div>
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                disabled={profileUpdateMutation.isPending}
                                                variant='success'
                                                className='px-8 py-2'
                                            >
                                                {profileUpdateMutation.isPending ? (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        <span>Guardando...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-3">
                                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                                        <span>Guardar Cambios</span>
                                                    </div>
                                                )}
                                            </Button>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Bottom Spacing */}
            < div className="h-16" ></div >
        </section >
    );
};

export default Profile;