import React, { useState } from 'react';
import { MessageCircle, Star, X, Send } from 'lucide-react';
import { Experience, Review } from '@/features/experience/types/experienceTypes';
import { axiosInstance } from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CTASectionProps {
    isVisible?: boolean;
    onWriteReview?: () => void;
    experience?: Experience;
    setReviews?: React.Dispatch<React.SetStateAction<Review[]>>;
}

const CTASection: React.FC<CTASectionProps> = ({
    isVisible = true,
    onWriteReview,
    experience,
    setReviews
}) => {
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const handleWriteReview = () => {
        setIsWritingReview(true);
        onWriteReview?.();
    };

    const handleCloseWriteReview = () => {
        setIsWritingReview(false);
        setRating(0);
        setHoverRating(0);
        setComment('');
    };

    const handleSubmitReview = async () => {
        if (isSubmitting || rating === 0) return;

        try {
            setIsSubmitting(true);

            await axiosInstance.post('/comentarios', {
                user_id: user?.id,
                type: 'experiencia',
                entity_id: experience?.id,
                rating: rating * 2,
                review: comment,
            });

            // Crear el nuevo comentario para el estado local
            const newReview: Review = {
                review_id: Date.now(), // ID temporal hasta que el backend responda
                userId: Number(user?.id) || 0,
                user_name: user?.name || 'Usuario',
                user_image: null,
                review_date: new Date().toISOString().split('T')[0],
                rating: rating * 2,
                comment: comment,
                responses: []
            };

            // Actualizar el estado local
            setReviews?.(prevReviews => [newReview, ...prevReviews]);

            toast.success('Comentario enviado correctamente');
            handleCloseWriteReview();
        } catch (error) {
            console.error("Error al enviar el comentario:", error);
            toast.error('Ocurrió un error al enviar el comentario. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleStarClick = (value: number) => {
        setRating(value);
    };

    const handleStarHover = (value: number) => {
        setHoverRating(value);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    if (!isVisible) return null;

    return (
        <section>
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 text-white text-center shadow-2xl">
                <div className="max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold">¿Te gustó nuestra experiencia?</h2>
                    <p className="text-emerald-100 text-lg">
                        Comparte tu experiencia con otros viajeros y ayúdanos a seguir mejorando
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {!isWritingReview ? (
                            <button
                                onClick={handleWriteReview}
                                className="bg-white cursor-pointer text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Escribir una opinión
                            </button>
                        ) : (
                            <div className="w-full max-w-lg mx-auto">
                                <div className="bg-white p-6 rounded-2xl shadow-2xl text-gray-800 space-y-2">
                                    {/* Header del formulario */}
                                    <div className="flex items-center justify-center text-center">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Tu opinión sobre
                                            <span
                                                className="text-emerald-600"
                                            > {experience?.name}
                                            </span>
                                        </h3>
                                    </div>

                                    {/* Rating de estrellas */}
                                    <div className=" flex flex-col items-center space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Califica tu experiencia
                                        </label>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => handleStarClick(value)}
                                                    onMouseEnter={() => handleStarHover(value)}
                                                    onMouseLeave={handleStarLeave}
                                                    className="transition-all duration-200 hover:scale-110 cursor-pointer"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${value <= (hoverRating || rating)
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {rating > 0 && (
                                            <p className="text-sm text-gray-600">
                                                {rating === 1 && "Muy malo"}
                                                {rating === 2 && "Malo"}
                                                {rating === 3 && "Regular"}
                                                {rating === 4 && "Bueno"}
                                                {rating === 5 && "Excelente"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Textarea para comentario */}
                                    <div className="">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cuéntanos sobre tu experiencia
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full h-28 p-3 rounded-xl border border-gray-300 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                            placeholder={`Comparte los detalles de tu experiencia en ${experience?.name}...`}
                                            maxLength={300}
                                        />
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {comment.length}/300 caracteres
                                            </span>
                                            {comment.length > 450 && (
                                                <span className="text-xs text-amber-600">
                                                    Casi alcanzas el límite
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <button
                                            onClick={handleCloseWriteReview}
                                            className="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={rating === 0 || isSubmitting}
                                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Publicar opinión
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;