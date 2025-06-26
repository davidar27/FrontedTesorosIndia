import React from 'react';
import { MapPin, Phone, Mail, User as UserIcon } from 'lucide-react';
import useAuth from '@/context/useAuth';
import Button from '@/components/ui/buttons/Button';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { useProfileLogic } from '@/features/profile/hook/useProfileLogic';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ActionButtons } from '@/features/profile/components/ActionButtons';

const Profile: React.FC = () => {
    const { user: authUser, isLoading: authLoading } = useAuth();
    const {
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
    } = useProfileLogic();

    const profileCards = [
        {
            icon: UserIcon,
            title: "Nombre Completo",
            value: editedProfile?.name || '',
            placeholder: "Tu nombre completo",
            gradientFrom: "from-emerald-50",
            gradientTo: "to-teal-50",
            borderColor: "border-emerald-100",
            iconBgColor: "bg-emerald-500",
            focusRingColor: "focus:ring-emerald-500",
            onChange: (value: string) => handleInputChange('name', value)
        },
        {
            icon: Mail,
            title: "Correo Electrónico",
            value: editedProfile?.email || '',
            placeholder: "tu@email.com",
            type: "email",
            gradientFrom: "from-blue-50",
            gradientTo: "to-indigo-50",
            borderColor: "border-blue-100",
            iconBgColor: "bg-blue-500",
            focusRingColor: "focus:ring-blue-500",
            onChange: (value: string) => handleInputChange('email', value)
        },
        {
            icon: Phone,
            title: "Teléfono",
            value: editedProfile?.phone || '',
            placeholder: "Número de teléfono",
            type: "tel",
            gradientFrom: "from-purple-50",
            gradientTo: "to-pink-50",
            borderColor: "border-purple-100",
            iconBgColor: "bg-purple-500",
            focusRingColor: "focus:ring-purple-500",
            onChange: (value: string) => handleInputChange('phone', value)
        },
        {
            icon: MapPin,
            title: "Dirección",
            value: editedProfile?.address || '',
            placeholder: "Tu dirección",
            gradientFrom: "from-orange-50",
            gradientTo: "to-red-50",
            borderColor: "border-orange-100",
            iconBgColor: "bg-orange-500",
            focusRingColor: "focus:ring-orange-500",
            onChange: (value: string) => handleInputChange('address', value)
        }
    ];

    if (authLoading || isProfileLoading) {
        return <LoadingSpinner message='Cargando tu perfil...' />;
    }

    if (!authUser || !profile) {
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
                        <ProfileHeader
                            profile={profile}
                            isEditing={isEditing}
                            previewImage={previewImage}
                            onImageChange={handleImageChange}
                        />

                        <div className="p-8 md:p-12">
                            <div className="grid gap-8">
                                {/* Information Cards */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {profileCards.map((card, index) => (
                                        <ProfileCard
                                            key={index}
                                            {...card}
                                            isEditing={isEditing}
                                        />
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <ActionButtons
                                    isEditing={isEditing}
                                    isLoading={profileUpdateMutation.isPending}
                                    onEdit={startEditing}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-16"></div>
        </section>
    );
};

export default Profile;