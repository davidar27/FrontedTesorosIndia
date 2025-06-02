import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/buttons/Button";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animación del número 404 */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
                    <h2 className="text-2xl text-gray-700">¡Página no encontrada!</h2>
                </motion.div>

                {/* Mensaje de error animado */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8"
                >
                    <p className="text-gray-600 mb-4">
                        Lo sentimos, parece que te has perdido en nuestro jardín de tesoros.
                        La página que buscas no existe o ha sido movida.
                    </p>
                    <p className="text-gray-500 text-sm">
                        ¿Te gustaría volver a explorar nuestros productos?
                    </p>
                </motion.div>

                {/* Botones de acción */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        onClick={() => navigate(-1)}
                        className="flex gap-2 items-center justify-center hover:bg-primary/90 hover:text-white"
                        bgColor="bg-white"
                        textColor="text-primary"
                    >
                        <ArrowLeft size={20} />
                        Volver atrás
                    </Button>
                    <Button
                        onClick={() => navigate("/")}
                        className="flex gap-2 items-center justify-center"
                    >
                        <Home size={20} />
                        Ir al inicio
                    </Button>
                </motion.div>

                {/* Decoración */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-12 text-sm text-gray-400"
                >
                    Tesoros de la India • Error 404
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;