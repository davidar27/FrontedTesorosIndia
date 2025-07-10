import { CheckCircle } from "lucide-react";

const SuccessModal = ({ showSuccessModal }: { showSuccessModal: boolean }) => (
    showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            ¡Producto Actualizado!
                        </h3>
                        <p className="text-gray-600">
                            El producto se ha actualizado correctamente
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
);

export default SuccessModal;