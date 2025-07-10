import { Tag } from "lucide-react";
import InputField from "./InputField";
import { ValidationErrors } from "../ProductInfoEdit";
import { EditedProduct } from "../ProductInfoEdit";
import { Category } from "@/features/admin/categories/CategoriesTypes";

const CategoryField = ({ errors, editedProduct, handleInputChange, categories }: { errors: ValidationErrors, editedProduct: EditedProduct, handleInputChange: (field: keyof EditedProduct, value: string | number) => void, categories: Category[] }) => (
    <InputField label="Categoría" error={errors.category_id} required>
        <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
                value={editedProduct.category_id}
                onChange={(e) => handleInputChange('category_id', Number(e.target.value))}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                    errors.category_id ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-white'
                }`}
            >
                <option value={0}>Selecciona una categoría</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    </InputField>
);

export default CategoryField;