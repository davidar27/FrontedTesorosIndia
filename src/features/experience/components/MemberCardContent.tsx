import { motion } from "framer-motion";
import { User, Briefcase, Calendar } from "lucide-react";

interface Member {
    name: string;
    age: string | number;
    profession: string;
    description: string;
}

interface MemberCardContentProps {
    member: Member;
    index?: number;
}

const MemberCardContent = ({ member, index = 0 }: MemberCardContentProps) => {
    return (
        <motion.div
            className="relative grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }}
        >
            {/* Header con nombre */}
            <motion.div
                className="mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <div className="flex items-start gap-2 mb-2">
                    <motion.div
                        className="p-1.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-sm"
                        whileHover={{
                            scale: 1.1,
                            rotate: 5,
                            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)"
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <User className="w-4 h-4 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight tracking-tight">
                        {member.name}
                    </h3>
                </div>
            </motion.div>

            {/* Badges informativos */}
            <motion.div
                className="flex flex-wrap items-center gap-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
            >
                <motion.div
                    className="flex items-center gap-1.5 bg-gradient-to-r from-slate-50 to-gray-100 
                     border border-gray-200 px-3 py-1.5 rounded-full shadow-sm
                     hover:shadow-md transition-all duration-200"
                    whileHover={{
                        scale: 1.05,
                        backgroundColor: "#f8fafc",
                        borderColor: "#cbd5e1"
                    }}
                >
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                        {member.age} años
                    </span>
                </motion.div>

                <motion.div
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-green-50 
                     border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm
                     hover:shadow-md transition-all duration-200"
                    whileHover={{
                        scale: 1.05,
                        backgroundColor: "#dcfce7",
                        borderColor: "#86efac"
                    }}
                >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                        {member.profession}
                    </span>
                </motion.div>
            </motion.div>

            {/* Descripción mejorada */}
            <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
            >
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 
                       border border-gray-100 shadow-sm hover:shadow-md 
                       transition-all duration-300 group">
                    <p className="text-gray-700 text-sm leading-relaxed font-medium 
                       line-clamp-3 group-hover:text-gray-800 transition-colors">
                        {member.description}
                    </p>

                    {/* Indicador de texto truncado */}
                    <motion.div
                        className="absolute bottom-2 right-2 w-2 h-2 bg-emerald-400 rounded-full
                       opacity-50 group-hover:opacity-100 transition-opacity"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </motion.div>

            {/* Decoración sutil */}
            <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br 
                   from-emerald-400 to-green-500 rounded-full opacity-20"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    );
};

export default MemberCardContent;