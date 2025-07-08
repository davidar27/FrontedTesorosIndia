import { axiosInstance } from '@/api/axiosInstance';
import { CreateProductData } from '@/features/products/components/CreateProductForm';

export const createProduct = async (product: CreateProductData & { experience_id: number }) => {
    const { experience_id, image, ...rest } = product;
    const formData = new FormData();

    // Agrega los campos de texto
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    // Agrega la imagen si existe
    if (image) {
        formData.append('file', image); 
    }

    const { data } = await axiosInstance.post(`/productos/${experience_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const ProductsApi = {
    getProductById: async (id: number) => {
        const response = await axiosInstance.get(`/productos/informacion/${id}`);
        return response.data;
    },
}