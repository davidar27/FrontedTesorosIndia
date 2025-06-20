import React, { useEffect, useState } from 'react';
import { Star, ShoppingCart, MessageCircle, MapPin, Users, Award, Heart, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { ExperienceApi } from '@/services/experience/experience';
import { useParams } from 'react-router-dom';
import { getImageUrl } from '@/features/admin/adminHelpers';
import ReusableMap from '@/components/shared/ReusableMap';
import useAuth from '@/context/useAuth';
import useExperiencePermissions from '@/hooks/useExperiencePermissions';
import EditModeNotification from '@/components/experience/EditModeNotification';
import { usePageContext } from '@/context/PageContext';

interface Experience {
    id: number;
    name: string;
    history: string;
    description: string;
    type: string;
    image: string;
    lat: number;
    lng: number;
    name_entrepreneur?: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

interface TeamMember {
    id: number;
    name: string;
    age: number;
    occupation: string;
    description: string;
    image: string;
}

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
}

const ExperiencePage: React.FC = () => {
    const { experience_id } = useParams();
    const { user } = useAuth();
    const { isEditMode } = usePageContext();
    
    const [info, setInfo] = useState<Experience[]>([]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [reviewsInfo, setReviewsInfo] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showEditNotification, setShowEditNotification] = useState(false);

    // Estados para edición
    const [editData, setEditData] = useState<Partial<Experience>>({});
    const [editMembers, setEditMembers] = useState<TeamMember[]>([]);
    const [editProducts, setEditProducts] = useState<Product[]>([]);

    // El modo edición ahora se activa manualmente con el botón
    useEffect(() => {
        // El modo edición se activará manualmente con el botón de editar
    }, [user, experience_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoData = await ExperienceApi.getInfo(Number(experience_id));
                setInfo(infoData);
                setEditData(infoData[0] || {});
                
                const reviewsData = await ExperienceApi.getReviews(Number(experience_id));
                setReviewsInfo(reviewsData.reviews || []);
                
                const productsData = await ExperienceApi.getProducts(Number(experience_id));
                setProducts(productsData);
                setEditProducts(productsData);
                
                const membersData = await ExperienceApi.getMembers(Number(experience_id));
                setMembers(membersData);
                setEditMembers(membersData);
                
                setIsLoading(false);
            } catch {
                setError(true);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [experience_id]);

    const currentExperience = info[0];
    const permissions = useExperiencePermissions();

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const convertRatingToFiveScale = (rating: number): number => {
        return (rating / 2);
    };

    const renderStars = (rating: number) => {
        const fiveScaleRating = rating > 5 ? convertRatingToFiveScale(rating) : rating;

        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFullStar = fiveScaleRating >= starValue;
            const isHalfStar = fiveScaleRating >= starValue - 0.5 && fiveScaleRating < starValue;

            return (
                <div key={index} className="relative inline-block">
                    <Star className="w-4 h-4 text-gray-300" />
                    <div
                        className={`absolute inset-0 overflow-hidden ${isFullStar ? 'w-full' : isHalfStar ? 'w-1/2' : 'w-0'}`}
                    >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                </div>
            );
        });
    };

    const averageRating = reviewsInfo.length > 0
        ? convertRatingToFiveScale(
            reviewsInfo.reduce((sum, review) => sum + review.rating, 0) / reviewsInfo.length
        )
        : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl">🌿</span>
                            </div>
                        </div>
                        <p className="text-gray-600 font-medium">Cargando experiencia...</p>
                        <p className="text-gray-400 text-sm mt-2">Preparando los tesoros para ti</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 ">
                <div className="max-w-md mx-auto pt-32 px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
                        <p className="text-gray-600 mb-6">No pudimos cargar esta experiencia. Por favor, intenta de nuevo.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50" >
            {/* Notificación de modo edición */}
            <EditModeNotification
                isVisible={showEditNotification && isEditMode}
                onClose={() => setShowEditNotification(false)}
                experienceName={currentExperience?.name || 'Tu experiencia'}
            />

            {/* Hero Section */}
            <section className="relative h-96 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(currentExperience?.image) || ''}
                        alt={currentExperience?.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                <div className="relative z-10 h-full flex items-end ">
                    <div className="container pb-16 responsive-padding-x">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {currentExperience?.type}
                                    </span>
                                    <div className="flex items-center gap-1 text-white">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">Colombia</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                    {currentExperience?.name}
                                </h1>
                                <div className="flex items-center gap-4 text-white">
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {renderStars(Math.round(averageRating))} 
                                        </div>
                                        <span className="font-medium ml-1"> 
                                            {averageRating.toFixed(1) || 'No hay calificaciones disponibles'}
                                        </span>
                                        <span className="text-white/80">
                                            ({reviewsInfo.length} opiniones)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto py-8 responsive-padding-x">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 -mt-16 relative z-10">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{members.length || 'No hay integrantes disponibles'} </p>
                                <p className="text-gray-600 text-sm">Integrantes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{products.length || 'No hay productos disponibles'}</p>
                                <p className="text-gray-600 text-sm">Productos</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1) || 'No hay calificaciones disponibles'}</p>
                                <p className="text-gray-600 text-sm">Calificación</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historia Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-600 text-xl">📜</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">Nuestra Historia</h2>
                            </div>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                {isEditMode ? (
                                    <textarea
                                        value={editData.history || ''}
                                        onChange={(e) => setEditData({ ...editData, history: e.target.value })}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                        rows={6}
                                        placeholder="Cuenta la historia de tu experiencia..."
                                    />
                                ) : (
                                    <p>{currentExperience?.history || 'No se ha proporcionado una historia para esta experiencia.'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Actividades y Mapa */}
                <section className="mb-12">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <span className="text-orange-600 text-xl">🌱</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">¿Qué hacemos?</h2>
                            </div>
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                {isEditMode ? (
                                    <textarea
                                        value={editData.description || ''}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                        rows={6}
                                        placeholder="Describe qué hace tu experiencia..."
                                    />
                                ) : (
                                    <p>{currentExperience?.description || 'No se ha proporcionado una descripción para esta experiencia.'}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Nuestra Ubicación</h3>
                                </div>
                            </div>
                            <div className="h-64">
                                <ReusableMap
                                    locations={[{
                                        id: currentExperience?.id || 0,
                                        position: { lat: currentExperience?.lat || 4, lng: currentExperience?.lng || -75 },
                                        name: currentExperience?.name || '',
                                        description: currentExperience?.description || '',
                                        type: currentExperience?.type || '',
                                    }]}
                                />
                                {currentExperience?.lat && currentExperience?.lng && (
                                    <div className="absolute top-4 right-4">
                                        <MapPin className="w-6 h-6 text-red-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integrantes Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">Nuestro Equipo</h2>
                            </div>
                            {isEditMode && permissions.canManageMembers && (
                                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Agregar Integrante
                                </button>
                            )}
                        </div>

                        <div className="relative w-full max-w-6xl overflow-hidden">
                            {(isEditMode ? editMembers : members).map((member) => (
                                <div key={member.id} className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="relative">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{member.name}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                                        <span className="bg-gray-100 px-2 py-1 rounded-lg">{member.age} años</span>
                                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">
                                                            {member.occupation}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {member.description}
                                                    </p>
                                                </div>
                                                {isEditMode && permissions.canManageMembers && (
                                                    <button className="text-red-500 hover:text-red-700 p-2">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(isEditMode ? editMembers : members).length === 0 && (
                                <div className="text-center text-gray-600">
                                    No hay integrantes disponibles para esta experiencia
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Productos Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">Nuestros Productos</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {isEditMode && permissions.canManageProducts && (
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Agregar Producto
                                    </button>
                                )}
                                <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 group">
                                    Ver todos
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="relative w-full max-w-6xl overflow-hidden">
                            {(isEditMode ? editProducts : products).map((product) => (
                                <div key={product.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            {isEditMode && permissions.canManageProducts && (
                                                <button className="p-2 bg-red-500/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            )}
                                            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
                                                <Heart className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-800 text-lg mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-emerald-600">
                                                {formatPrice(product.price)}
                                            </span>
                                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 group">
                                                <ShoppingCart className="w-4 h-4" />
                                                <span className="hidden sm:inline">Agregar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(isEditMode ? editProducts : products).length === 0 && (
                                <div className="text-center text-gray-600">
                                    No hay productos disponibles para esta experiencia
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Valoraciones Section - Solo en modo vista */}
                {!isEditMode && (
                    <section className="mb-12">
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Star className="w-6 h-6 text-amber-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">Valoraciones</h2>
                            </div>

                            {/* Rating Summary */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                            <div className="text-5xl font-bold text-gray-800">
                                                {averageRating.toFixed(1)}
                                            </div>
                                            <div>
                                                <div className="flex mb-2">
                                                    {renderStars(Math.round(averageRating))}
                                                </div>
                                                <div className="text-gray-600">
                                                    {reviewsInfo.length} valoraciones
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => {
                                            const count = reviewsInfo.filter(r => {
                                                const convertedRating = convertRatingToFiveScale(r.rating);
                                                return Math.round(convertedRating) === rating;
                                            }).length;
                                            const percentage = reviewsInfo.length > 0 ? (count / reviewsInfo.length) * 100 : 0;

                                            return (
                                                <div key={rating} className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600 w-4">{rating}</span>
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-12">
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800">Opiniones recientes</h3>
                                {reviewsInfo.slice(0, 3).map((review) => (
                                    <div key={review.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                                        <div className="flex gap-4">
                                            <img
                                                src={review.avatar}
                                                alt={review.userName}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-gray-800">{review.userName}</span>
                                                        <div className="flex">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{review.date}</span>
                                                </div>
                                                <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                                                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                                    Responder
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {reviewsInfo.length > 3 && (
                                    <div className="text-center">
                                        <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto group">
                                            Ver todas las opiniones
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section - Solo en modo vista */}
                {!isEditMode && (
                    <section className="mb-8">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 text-white text-center">
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-3xl font-bold mb-4">¿Te gustó nuestra experiencia?</h2>
                                <p className="text-emerald-100 mb-6 text-lg">
                                    Comparte tu experiencia con otros viajeros y ayúdanos a seguir mejorando
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-3 group">
                                        <MessageCircle className="w-5 h-5" />
                                        Escribir una opinión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ExperiencePage;