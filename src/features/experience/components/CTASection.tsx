import React from 'react';
import { MessageCircle } from 'lucide-react';

interface CTASectionProps {
    isVisible?: boolean;
    onWriteReview?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({
    isVisible = true,
    onWriteReview
}) => {
    if (!isVisible) return null;

    return (
        <section className="mb-8">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">¿Te gustó nuestra experiencia?</h2>
                    <p className="text-emerald-100 mb-6 text-lg">
                        Comparte tu experiencia con otros viajeros y ayúdanos a seguir mejorando
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onWriteReview}
                            className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-3 group"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Escribir una opinión
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;