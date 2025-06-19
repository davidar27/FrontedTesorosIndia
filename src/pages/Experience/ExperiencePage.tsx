import React, { useEffect, useState } from 'react';
import { Star, ShoppingCart, MessageCircle } from 'lucide-react';
import { ExperienceApi } from '@/services/experience/experience';
import { useParams } from 'react-router-dom';
import { getImageUrl } from '@/features/admin/adminHelpers';
import ReusableMap from '@/components/shared/ReusableMap';


interface Experience {
    id: number;
    name: string;
    history: string;
    description: string;
    type: string;
    image: string;
    lat: number;
    lng: number;
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
    const { experience_id } = useParams()
    const [info, setInfo] = useState<Experience[]>([])
    const [members, setMembers] = useState<TeamMember[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [reviewsInfo, setReviewsInfo] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoData = await ExperienceApi.getInfo(Number(experience_id));
                setInfo(infoData);
                const reviewsData = await ExperienceApi.getReviews(Number(experience_id));
                setReviewsInfo(reviewsData.reviews || []);
                const productsData = await ExperienceApi.getProducts(Number(experience_id));
                setProducts(productsData);
                const membersData = await ExperienceApi.getMembers(Number(experience_id));
                setMembers(membersData);
                console.log("info: ", infoData);
                console.log("members: ", membersData);
                console.log("products: ", productsData);
                console.log("reviews: ", reviewsData);
                setIsLoading(false)
            }
            catch {
                setError(true)
                setIsLoading(false)
            }
        }
        fetchData()
    }, [experience_id])



    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'fill-green-500 text-green-500' : 'text-gray-300'
                    }`}
            />
        ));
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando experiencia...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
                        <p className="text-gray-600">No se pudo cargar la información de la experiencia.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="responsive-padding-y">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 justify-center py-10  ">
                <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-3xl">🌿</span>
                </div>
                <h1 className="text-4xl font-bold text-green-700">{info[0]?.name}</h1>
            </div>

            {/* Historia Section */}
            <section className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h2 className="text-xl font-bold text-green-700 mb-4">Nuestra Historia</h2>
                        <div className="text-sm text-gray-700 space-y-3">
                            <p>{info[0]?.history}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src={getImageUrl(info[0]?.image) || ''}
                            alt="Vista aérea de la finca"
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                </div>
            </section>

            {/* Actividades Section */}
            <section className="p-6 bg-white">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h2 className="text-xl font-bold text-green-700 mb-4">¿Qué hacemos?</h2>
                        <div className="text-sm text-gray-700 space-y-3">
                            <p>{info[0]?.description}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <ReusableMap
                            locations={[{
                                id: info[0]?.id || 0,
                                position: { lat: info[0]?.lat || 4.678, lng: info[0]?.lng || -75.668 },
                                name: info[0]?.name || '',
                                description: info[0]?.description || '',
                                type: info[0]?.type || ''
                            }]}
                        />
                    </div>
                </div>
            </section>

            {/* Integrantes Section */}
            <section className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <h2 className="text-xl font-bold text-green-700 mb-6">Integrantes</h2>
                <div className="space-y-6">
                    {members.map((member) => (
                        <div key={member.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800 mb-1">{member.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    Edad: {member.age} años | Ocupación: {member.occupation}
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Productos Section */}
            <section className="p-6 bg-white">
                <h2 className="text-xl font-bold text-green-700 mb-6">Nuestros Productos</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-green-600">
                                        {formatPrice(product.price)}
                                    </span>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" />
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Valoraciones Section */}
            <section className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <h2 className="text-xl font-bold text-green-700 mb-6">Valoraciones</h2>

                {/* Rating Summary */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800">4.5</div>
                            <div className="flex justify-center mb-1">
                                {renderStars(5)}
                            </div>
                            <div className="text-sm text-gray-600">1.060</div>
                        </div>
                        <div className="flex-grow">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-600 w-4">{rating}</span>
                                    <div className="flex-grow bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: rating === 5 ? '60%' : rating === 4 ? '30%' : '10%' }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">
                                        {rating === 5 ? '60%' : rating === 4 ? '30%' : '10%'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Opiniones</h3>
                    {reviewsInfo.map((review) => (
                        <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-start gap-3">
                                <img
                                    src={review.avatar}
                                    alt={review.userName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-800">{review.userName}</span>
                                        <div className="flex">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{review.date}</span>
                                        <button className="hover:text-gray-700">Responder</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="p-6 bg-green-600 text-white">
                <div className="text-center">
                    <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                        <MessageCircle className="w-5 h-5" />
                        Escribir un opinion
                    </button>
                </div>
            </section>
        </section>
    );
};

export default ExperiencePage;