import LoginForm from "@/features/Auth/components/LoginForm";
import banner from "@/assets/images/banner2.webp";
import imgLogo from '@/assets/icons/logotesorosindiaPequeño.webp';
import Picture from "@/components/ui/Picture";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";



const LoginPage: React.FC = () => {

    
    return (
        <section className="min-h-screen bg-cover bg-center flex items-center justify-center text-black  md:p-14" style={{ backgroundImage: `url(${banner})` }}
        >
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center relative">
                <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-full overflow-hidden bg-white p-1.5 shadow-md">
                    <Picture src={imgLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>

                <Link to="/" className="absolute top-4 left-4 hover:text-gray-700 transition duration-200">
                    <ChevronLeft className="w-10 h-10"/>

                </Link>

                <h1 className="text-2xl font-bold mt-16">Inicio de sesión</h1>
                <p className="text-sm text-gray-600 mt-1 mb-6">Inicia de sesión con tu cuenta de Tesoros India</p>

                <LoginForm />
            </div>
        </section>
    );
};

export default LoginPage;   
