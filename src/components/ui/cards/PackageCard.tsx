import { motion } from "framer-motion";
import { useState } from "react";


type PackageCardProps = {
    image?: string;
    title: string;
    description: string;
    price?: string;
    features?: string[];
    onClick?: () => void;
    isCreateCard?: boolean;
    category?: string;
};

export const PackageCard = ({
    image,
    title,
    description,
    price,
    features = [],
    onClick,
    isCreateCard = false,
    category = "Popular",
}: PackageCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative overflow-hidden flex flex-col justify-center rounded-xl shadow-lg w-full max-w-xs border-2 ${isCreateCard
                ? 'border-dashed border-green-500/40 bg-green-50/30'
                : 'border-transparent'
                }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            {!isCreateCard && !isHovered && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        {category}
                    </span>
                </div>
            )}

            {isCreateCard ? (
                <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                    <motion.div
                        className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center mb-4"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="text-5xl font-thin text-green-600">+</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-700 mt-2">Crear Nuevo Paquete</h3>
                    <p className="text-gray-600 mt-2">Personalice su propia experiencia según sus preferencias</p>
                </div>
            ) : (
                <>
                    <div className="relative h-56 overflow-hidden">
                        <motion.img
                            src={image || "/placeholder-image.jpg"}
                            alt={title}
                            className="w-full h-full object-cover"
                            animate={{
                                scale: isHovered ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.4 }}
                        />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                            animate={{ opacity: isHovered ? 0.8 : 0.5 }}
                        />

                        <motion.div
                            className="absolute bottom-0 left-0 right-0 p-4 text-white"
                            animate={{ y: isHovered ? -10 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="text-xl font-bold drop-shadow-md">{title}</h3>
                            {price && (
                                <div className="flex items-center mt-1">
                                    <span className="text-lg font-bold">{price}</span>
                                    <span className="text-sm opacity-80 ml-1">/persona</span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <div className="p-5">
                        <p className="text-gray-700">{description}</p>

                        {features.length > 0 && (
                            <ul className="mt-3 space-y-1">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}

            <div className="p-5 pt-0 flex justify-center">
                <motion.button
                    className={`py-2 px-6 rounded-full font-medium flex items-center justify-center gap-2 ${isCreateCard
                        ? 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white'
                        : 'bg-green-600 text-white hover:bg-green-700'
                        } transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isCreateCard ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Crear paquete</span>
                        </>
                    ) : (
                        <>
                            <span>Ver detalles</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};


export default PackageCard;