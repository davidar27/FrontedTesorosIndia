import { axiosInstance } from '@/api/axiosInstance';
import { CreateProductData } from '@/features/products/components/CreateProductForm';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';

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

export const updateProduct = async (productId: number, experienceId: number, productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    userId: number;
    category_id: number;
    image?: File;
}) => {
    const { image, ...rest } = productData;
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

    const { data } = await axiosInstance.put(`/productos/${productId}/${experienceId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const deleteProduct = async (productId: number) => {
    const response = await axiosInstance.put(`/productos/estado/${productId}`, {
        status: 'inactivo'
    });
    return response.data;
};

export const ProductsApi = {
    getProductById: async (id: number) => {
        const response = await axiosInstance.get(`/productos/informacion/${id}`);
        return response.data;
    },
}