import Button from "@/components/ui/buttons/Button";
import { Edit3, Save, X } from "lucide-react";


export const ActionButtons: React.FC<{
    isEditing: boolean;
    isLoading: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}> = ({ isEditing, isLoading, onEdit, onSave, onCancel }) => (
    <div className="flex justify-center pt-8 border-t border-gray-100">
        {!isEditing ? (
            <Button
                onClick={onEdit}
                variant='secondary'
                className='px-8 py-2'
            >
                <div className="flex items-center space-x-3">
                    <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Editar Perfil</span>
                </div>
            </Button>
        ) : (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                    onClick={onCancel}
                    disabled={isLoading}
                    variant='danger'
                    className='px-8 py-2'
                >
                    <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Cancelar</span>
                    </div>
                </Button>
                <Button
                    onClick={onSave}
                    disabled={isLoading}
                    variant='success'
                    className='px-8 py-2'
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Guardando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>Guardar Cambios</span>
                        </div>
                    )}
                </Button>
            </div>
        )}
    </div>
);