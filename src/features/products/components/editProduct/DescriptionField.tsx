import { FileText } from "lucide-react";
import InputField from "@/features/products/components/editProduct/InputField";
import { ValidationErrors } from "@/features/products/components/ProductInfoEdit";
import { EditedProduct } from "@/features/products/components/ProductInfoEdit";

const DescriptionField = ({ errors, editedProduct, handleInputChange }: { errors: ValidationErrors, editedProduct: EditedProduct, handleInputChange: (field: keyof EditedProduct, value: string | number) => void }) => (
    <InputField label="Descripción del producto" error={errors.description} required>
        <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
                value={editedProduct.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                placeholder="Describe tu producto de manera detallada..."
            />
        </div>
    </InputField>
);  
export default DescriptionField;