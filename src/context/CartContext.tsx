import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { useAuth } from "./AuthContext";

export type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
};

interface CartContextType {
    items: CartItem[];
    total: number;
    handleAddToCart: (item: CartItem) => Promise<void>;
    handleRemoveFromCart: (id: number) => Promise<void>;
    handleUpdateQuantity: (id: number, quantity: number) => Promise<void>;
    handleClearCart: () => Promise<void>;
    handleFetchCart: () => Promise<void>;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};

const CART_STORAGE_KEY = "cart_items";

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const calcularTotal = (products: CartItem[]) =>
        products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const guardarEnLocalStorage = (products: CartItem[]) => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(products));
    };

    const handleFetchCart = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/carrito/obtener");
            setItems(data.products || []);
            guardarEnLocalStorage(data.products || []);
        } catch {
            // Si falla, intenta cargar del localStorage
            const local = localStorage.getItem(CART_STORAGE_KEY);
            if (local) setItems(JSON.parse(local));
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (item: CartItem) => {
        setLoading(true);
        try {
            await axiosInstance.post("/carrito/agregar", { productId: item.id, quantity: item.quantity, userId: user?.id });
            await handleFetchCart();
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (id: number) => {
        setLoading(true);
        try {
            await axiosInstance.delete("/carrito/eliminar", { data: { productId: id } });
            await handleFetchCart();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (id: number, quantity: number) => {
        setLoading(true);
        try {
            await axiosInstance.put("/carrito/actualizar", { productId: id, quantity });
            await handleFetchCart();
        } finally {
            setLoading(false);
        }
    };

    const handleClearCart = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete("/carrito/vaciar");
            await handleFetchCart();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchCart();
        // eslint-disable-next-line
    }, []);

    const total = calcularTotal(items);

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                handleAddToCart,
                handleRemoveFromCart,
                handleUpdateQuantity,
                handleClearCart,
                handleFetchCart,
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}; 