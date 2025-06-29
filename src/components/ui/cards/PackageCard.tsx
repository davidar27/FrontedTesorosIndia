import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { useNavigate } from "react-router-dom";
import { Detail } from "@/features/packages/types/packagesTypes";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";


type PackageCardProps = {
    image?: string;
    name: string;
    description: string;
    price?: string;
    details?: Detail[];
    onClick?: () => void;
    isCreateCard?: boolean;
    id?: number;
};

export const PackageCard = ({
    image,
    name,
    description,
    price,
    details = [],
    onClick,
    isCreateCard = false,
    id,
}: PackageCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
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



            <div className="relative h-56 overflow-hidden">
                <motion.img
                    src={getImageUrl(image) || "/placeholder-image.jpg"}
                    alt={name}
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
                    <h3 className="text-xl font-bold drop-shadow-md">{name}</h3>
                    {price && (
                        <div className="flex items-center mt-1">
                            <span className="text-lg font-bold">{formatPrice(Number(price))}</span>
                            <span className="text-sm opacity-80 ml-1">/persona</span>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="p-5">
                <p className="text-gray-700">{description}</p>

                {details.length > 0 && (
                    <ul className="mt-3 space-y-1">
                        {details.map((detail, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {detail.detail}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="p-5 pt-0 flex justify-center">
                <Button
                    variant="primary"
                    onClick={() => navigate(`/paquetes/${id}`)}
                    disabled={!id}
                >
                    <span>Ver detalles</span>
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Button>
            </div>
        </motion.div>
    );
};


export default PackageCard;