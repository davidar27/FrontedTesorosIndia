import { Package, Save, X } from "lucide-react";

const Header = ({ handleCancel, handleSave, isLoading }: { handleCancel: () => void, handleSave: () => void, isLoading: boolean }) => (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">Editar Producto</h2>
                <p className="text-sm text-gray-500">Actualiza la información del producto</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200"
                disabled={isLoading}
            >
                <X className="w-4 h-4" />
                Cancelar
            </button>
            <button
                onClick={handleSave}
                className="flex items-center text-sm md:text-base gap-2 px-6 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-6 h-6" />
                        Guardar Cambios
                    </>
                )}
            </button>
        </div>
    </div>
);
export default Header;