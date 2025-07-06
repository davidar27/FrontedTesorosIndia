import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
export type CartItem = {
    service_id?: number;
    product_id?: number;
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
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};

const CART_STORAGE_KEY = "cart_items";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCartItem = (item: any): CartItem => ({
    service_id: item.service_id ?? item.serviceId ?? undefined,
    product_id: item.product_id ?? item.productId ?? undefined,
    name: item.name,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
    priceWithTax: typeof item.priceWithTax === 'string' ? parseFloat(item.priceWithTax) : item.priceWithTax,
    quantity: item.quantity,
    image: item.image,
    stock: item.stock,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    console.log(items);

    const calcularTotal = (products: CartItem[]) =>
        products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const guardarEnLocalStorage = (products: CartItem[]) => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(products));
    };

    const mostrarToast = (msg: string) => {
        // Puedes reemplazar esto por tu sistema de toast global
        toast.error(msg);
    };

    const handleFetchCart = useCallback(async () => {
        const blockedRoles = ['observador', 'administrador', 'emprendedor'];

        if (!isAuthenticated || blockedRoles.includes(user?.role ?? '')) return;

        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/carrito/obtener");
            const normalized = (data || []).map(normalizeCartItem);
            setItems(normalized);
            guardarEnLocalStorage(normalized);
        } catch {
            // Si falla, ya está el localStorage
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user?.role]);

    // Inicializar carrito desde localStorage
    useEffect(() => {
        const local = localStorage.getItem(CART_STORAGE_KEY);
        if (local) {
            setItems(JSON.parse(local));
        }

        if (isAuthenticated && user?.role !== 'observador' && !authLoading) {
            handleFetchCart();
        }
    }, [isAuthenticated, user?.role, authLoading, handleFetchCart]);

    function isSameCartItem(a: CartItem, b: CartItem) {
        if (a.service_id !== undefined && b.service_id !== undefined) {
            return a.service_id === b.service_id;
        }
        if (a.product_id !== undefined && b.product_id !== undefined) {
            return a.product_id === b.product_id;
        }
        return false;
    }

    const handleAddToCart = (item: CartItem) => {
        let shouldSendRequest = false;
        setItems(prev => {
            const exists = prev.find(i => isSameCartItem(i, item));
            let updated;

            // Calcular la cantidad total que tendría el producto
            const currentQty = exists ? exists.quantity : 0;
            const newQty = currentQty + item.quantity;
            const maxStock = item.stock ?? exists?.stock ?? 0;

            if (newQty > maxStock) {
                mostrarToast("No hay suficiente stock disponible.");
                shouldSendRequest = false;
                return prev; 
            }

            shouldSendRequest = true;
            if (exists) {
                updated = prev.map(i => isSameCartItem(i, item) ? { ...i, quantity: newQty } : i);
            } else {
                updated = [...prev, { ...item, quantity: item.quantity }];
            }
            guardarEnLocalStorage(updated);
            return updated;
        });

        if (
            shouldSendRequest &&
            isAuthenticated &&
            user?.role !== 'observador' &&
            user?.id
        ) {
            axiosInstance.post("/carrito/agregar", { serviceId: item.service_id, productId: item.product_id, quantity: item.quantity, userId: user.id })
                .catch(() => mostrarToast("Error al sincronizar con el servidor (agregar)."));
        }
    };

    const handleRemoveFromCart = (item: CartItem) => {
        setItems(prev => {
            console.log(item);
            const updated = prev.filter(i => !isSameCartItem(i, item));
            guardarEnLocalStorage(updated);
            return updated;
        });
        if (isAuthenticated && user?.role !== 'observador') {
            axiosInstance.delete("/carrito/eliminar", { data: { serviceId: item.service_id, productId: item.product_id } })
                .catch(() => mostrarToast("Error al sincronizar con el servidor (eliminar)."));
        }
    };

    const handleUpdateQuantity = (item: CartItem) => {
        setItems(prev => {
            const updated = prev.map(i =>
                isSameCartItem(i, item)
                    ? { ...i, quantity: item.quantity, image: item.image, stock: item.stock }
                    : { ...i }
            );
            guardarEnLocalStorage(updated);
            return updated;
        });
        if (isAuthenticated && user?.role !== 'observador') {
            axiosInstance.put("/carrito/actualizar", { serviceId: item.service_id, productId: item.product_id, quantity: item.quantity })
                .catch(() => mostrarToast("Error al sincronizar con el servidor (actualizar cantidad)."));
        }
    };

    const handleClearCart = () => {
        setItems([]);
        guardarEnLocalStorage([]);
        setTimeout(() => {
            if (isAuthenticated && user?.role !== 'observador') {
                axiosInstance.delete("/carrito/vaciar")
                    .catch(() => mostrarToast("Error al sincronizar con el servidor (vaciar carrito)."));
            }
        }, 1000);
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
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}; 