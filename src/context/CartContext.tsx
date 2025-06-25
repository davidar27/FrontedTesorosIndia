import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { useAuth } from "./AuthContext";

export type CartItem = {
    id: number;
    productId?: number;
    name: string;
    price: number;
    priceWithTax: number;
    quantity: number;
    image?: string;
    stock: number;
};

interface CartContextType {
    items: CartItem[];
    total: number;
    handleAddToCart: (item: CartItem) => void;
    handleRemoveFromCart: (item: CartItem) => void;
    handleUpdateQuantity: (item: CartItem) => void;
    handleClearCart: () => void;
    handleFetchCart: () => void;
    handleClearCartAfterPayment: () => void;
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

    const mostrarToast = (msg: string) => {
        // Puedes reemplazar esto por tu sistema de toast global
        window.alert(msg);
    };

    const handleFetchCart = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/carrito/obtener");
            setItems(data || []);
            guardarEnLocalStorage(data || []);
        } catch {
            // Si falla, ya está el localStorage
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Inicializar carrito desde localStorage
    useEffect(() => {
        const local = localStorage.getItem(CART_STORAGE_KEY);
        if (local) {
            setItems(JSON.parse(local));
        }
        // Si hay usuario, sincronizar con backend en background
        if (user) {
            handleFetchCart();
        }
        // eslint-disable-next-line
    }, [user, handleFetchCart]);

    const handleAddToCart = (item: CartItem) => {
        setItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            let updated;
            if (exists) {
                updated = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            } else {
                updated = [...prev, { ...item, quantity: item.quantity  }];
            }
            guardarEnLocalStorage(updated);
            return updated;
        });
        // Sincronizar en background
        if (user) {
            axiosInstance.post("/carrito/agregar", { productId: item.id, quantity: item.quantity, userId: user.id })
                .catch(() => mostrarToast("Error al sincronizar con el servidor (agregar)."));
        }
    };

    const handleRemoveFromCart = (item: CartItem) => {
        setItems(prev => {
            const updated = prev.filter(i => i.id !== item.id);
            guardarEnLocalStorage(updated);
            return updated;
        });
        if (user) {
            axiosInstance.delete("/carrito/eliminar", { data: { productId: item.id } })
                .catch(() => mostrarToast("Error al sincronizar con el servidor (eliminar)."));
        }
    };

    const handleUpdateQuantity = (item: CartItem) => {
        setItems(prev => {
            const updated = prev.map(i => 
                i.id === item.id 
                    ? { ...i, quantity: item.quantity, image: item.image, stock: item.stock } 
                    : { ...i }
            );
            guardarEnLocalStorage(updated);
            return updated;
        });
        if (user) {
            axiosInstance.put("/carrito/actualizar", { productId: item.productId ?? item.id, quantity: item.quantity })
                .catch(() => mostrarToast("Error al sincronizar con el servidor (actualizar cantidad)."));
        }
    };

    const handleClearCart = () => {
        setItems([]);
        guardarEnLocalStorage([]);
        if (user) {
            axiosInstance.delete("/carrito/vaciar")
                .catch(() => mostrarToast("Error al sincronizar con el servidor (vaciar carrito)."));
        }
    };

    // Limpiar carrito tras pago exitoso
    const handleClearCartAfterPayment = () => {
        setItems([]);
        guardarEnLocalStorage([]);
    };

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
                handleClearCartAfterPayment,
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}; 