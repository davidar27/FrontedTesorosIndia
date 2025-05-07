import LoginForm from "@/features/Auth/components/LoginForm";
import banner from "@/assets/images/banner2.webp";

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: banner }}>
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center relative">
                {/* Logo */}
                <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-white">
                    <img src="/ruta-a-tu-logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>

                <h1 className="text-2xl font-bold mt-16">Inicio de sesión</h1>
                <p className="text-sm text-gray-600 mt-1 mb-6">Inicia de sesión con tu cuenta de Tesoros India</p>

                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;   
