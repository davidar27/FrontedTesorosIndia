import { DollarSign } from "lucide-react";
import InputField from '@/features/products/components/editProduct/InputField';
import { formatPrice } from "@/utils/formatPrice";
import { ValidationErrors } from '@/features/products/components/ProductInfoEdit';
import { EditedProduct } from '@/features/products/components/ProductInfoEdit';

const PriceField = ({ errors, editedProduct, handleInputChange, isEditingPrice, handlePriceClick, handlePriceBlur, handlePriceKeyDown }: { errors: ValidationErrors, editedProduct: EditedProduct, handleInputChange: (field: keyof EditedProduct, value: string | number) => void, isEditingPrice: boolean, handlePriceClick: () => void, handlePriceBlur: () => void, handlePriceKeyDown: (e: React.KeyboardEvent) => void }) => (
    <InputField label="Precio" error={errors.price} required>
        <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {isEditingPrice ? (
                <input
                    type="number"
                    value={editedProduct.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    onBlur={handlePriceBlur}
                    onKeyDown={handlePriceKeyDown}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg font-semibold ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                    step="1000"
                    placeholder="0"
                    autoFocus
                />
            ) : (
                <div
                    onClick={handlePriceClick}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 ${errors.price
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-gray-300 bg-gray-50 hover:bg-white text-emerald-600'
                        }`}
                >
                    {formatPrice(editedProduct.price)}
                </div>
            )}
        </div>
    </InputField>
);

export default PriceField;