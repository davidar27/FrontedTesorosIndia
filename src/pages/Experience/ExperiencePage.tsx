import React, { useEffect, useState } from 'react';
import { Star, MapPin, ShoppingCart, MessageCircle } from 'lucide-react';
import { ExperienceApi } from '@/services/experience/experience';
import { useParams } from 'react-router-dom';

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
    const [info, setInfo] = useState([])
    const [members, setMembers] = useState([])
    const [products, setProducts] = useState([])
    const [reviewsInfo, setReviewsInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoData = await ExperienceApi.getInfo(Number(experience_id));
                setInfo(infoData);
                const reviewsData = await ExperienceApi.getReviews(Number(experience_id));
                setReviewsInfo(reviewsData);
                const productsData = await ExperienceApi.getProducts(Number(experience_id));
                setReviewsInfo(productsData);
                const membersData = await ExperienceApi.getMembers(Number(experience_id));
                setReviewsInfo(reviewsData);
                console.log("info: ", infoData);
                console.log("members: ", membersData);
                console.log("products: ", productsData);
                console.log("reviews: ", reviewsData);
                setIsLoading(false)
            }
            catch {
                setError(true)
            }
        }
        fetchData()
    }, [experience_id])


    const teamMembers: TeamMember[] = [
        {
            id: 1,
            name: "Luis Abel Cárdenas León (propietario)",
            age: 66,
            occupation: "Cuidador",
            description: "Luis Abel es nacido en la vereda La India, municipio de Filandia. Desde niño, cumple con actividades agropecuarias. Asimismo, terminó la Educación Básica Primaria, Básica Secundaria y Universitaria para desempeñarse como docente en la escuela de su vereda natal, de esta forma, cumple con sus funciones como supervisor de Educación en la secretaría Departamental de Educación del Quindío.",
            image: "/api/placeholder/100/100"
        },
        {
            id: 2,
            name: "José Ovidio Cárdenas León (emprendedor tesoros de la India)",
            age: 54,
            occupation: "Agricultor",
            description: "José Ovidio es nacido de la vereda La India, municipio de Filandia. Desde niño, cumple con actividades agropecuarias. Por otra parte, estudió hasta quinto de Primaria, aunque estuvo desempeñándose en actividades de campo, no solo como caficultor sino como ganadero en sus fincas del cultivo. Siente amor por el comerciante de ganado. Desde siempre ha estado enamorado del campo, con este amor aplica lo aprendido durante su vida para el proyecto de turismo rural comunitario con proyectivas regenerativas en Tesoros de la India.",
            image: "/api/placeholder/100/100"
        }
    ];


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

    return (
        <div className="max-w-4xl mx-auto bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xl">🌿</span>
                    </div>
                    <h1 className="text-2xl font-bold text-green-700">BRISAS DEL GUADUAL</h1>
                </div>
            </div>

            {/* Historia Section */}
            <section className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h2 className="text-xl font-bold text-green-700 mb-4">Nuestra Historia</h2>
                        <div className="text-sm text-gray-700 space-y-3">
                            <p>
                                La finca Brisas del Guadual, se halla ubicada en jurisdicción del
                                corregimiento de La India (cerca del caserio de la vereda La India)
                                municipio de Filandia, Quindío.
                            </p>
                            <p>
                                La finca tiene una superficie aproximada de 2 cuadras.
                                Antiguamente, hacía parte de una propiedad de mayor extensión.
                                Posteriormente se segregó la actual finca Brisas del Guadual.
                            </p>
                            <p>
                                La gran extensión pertenecía a Guillermo Guerrero e Hilda Cárdenas,
                                posteriormente a José Ovidio.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/api/placeholder/400/300"
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
                            <p>
                                El arrendatario se encarga de labores de cultivo de café,
                                plátano y demás actividades orientadas al usufructo agrícola,
                                así como del mantenimiento y conservación del predio.
                            </p>
                            <p>
                                Actualmente sirve de escenario para desarrollar acciones
                                relacionadas con el turismo rural comunitario con prácticas
                                regenerativas. Esta modalidad de turismo tiene por objetivo
                                conservar el medio ambiente, así como la recuperación de la
                                cultura y tradiciones locales.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/api/placeholder/400/300"
                            alt="Mapa satelital de la ubicación"
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute top-4 right-4">
                            <MapPin className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrantes Section */}
            <section className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <h2 className="text-xl font-bold text-green-700 mb-6">Integrantes</h2>
                <div className="space-y-6">
                    {teamMembers.map((member) => (
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
                    {reviews.map((review) => (
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
        </div>
    );
};

export default ExperiencePage;