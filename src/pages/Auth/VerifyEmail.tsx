import { useState, useEffect } from 'react';
import { resendVerificationEmail } from '@/services/auth/resendService';
import { Mail, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const VerifyEmail = () => {
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();
    const email = location.state?.email;


    useEffect(() => {
        if (resendSuccess) {
            const timeout = setTimeout(() => setResendSuccess(false), 10000);
            return () => clearTimeout(timeout);
        }
    }, [resendSuccess]);

    const handleResendEmail = async () => {
        setIsResending(true);
        setError('');
        setResendSuccess(false);

        try {
            await resendVerificationEmail(email);
            setResendSuccess(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {

            setError('Error al reenviar el correo. Intenta nuevamente.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Mail className="h-10 w-10 text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu correo electrónico</h2>

                <p className="text-gray-600 mb-4">
                    Hemos enviado un enlace de verificación a <span className="font-semibold">{email}</span>.
                    Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar tu registro.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 w-full">
                    <p className="text-yellow-700">
                        <strong>¿No ves el correo?</strong> Revisa tu carpeta de spam o solicita un nuevo enlace.
                    </p>
                </div>

                <button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className={`flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white font-medium ${isResending ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isResending ? (
                        <>
                            <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Mail className="h-5 w-5 mr-2" />
                            Reenviar correo de verificación
                        </>
                    )}
                </button>

                {resendSuccess && (
                    <p className="mt-4 text-green-600 text-sm">
                        ¡Correo reenviado con éxito! Revisa tu bandeja de entrada.
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-red-600 text-sm">
                        {error}
                    </p>
                )}

                <p className="mt-6 text-sm text-gray-500">
                    ¿Ingresaste un correo incorrecto?{' '}
                    <a href="/update-email" className="text-blue-600 hover:underline">
                        Actualizar correo electrónico
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;