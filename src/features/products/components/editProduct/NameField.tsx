import { Package } from "lucide-react";
import InputField from "@/features/products/components/editProduct/InputField";
import { ValidationErrors } from "@/features/products/components/ProductInfoEdit";
import { EditedProduct } from "@/features/products/components/ProductInfoEdit";

const NameField = ({ errors, editedProduct, handleInputChange }: { errors: ValidationErrors, editedProduct: EditedProduct, handleInputChange: (field: keyof EditedProduct, value: string | number) => void }) => (
    <InputField label="Nombre del producto" error={errors.name} required>
        <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={editedProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg font-semibold ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                placeholder="Nombre del producto"
            />
        </div>
    </InputField>
);
export default NameField;