import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

type CartSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const {
        items,
        total,
        handleRemoveFromCart,
        handleUpdateQuantity,
        handleClearCart,
        loading,
    } = useCart();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") onClose();
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            role="complementary"
            aria-label="Carrito de compras"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">Carrito de compras</h2>
                <button
                    aria-label="Cerrar carrito"
                    onClick={onClose}
                    className="p-2 rounded hover:bg-gray-100 focus:outline-none"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                    <p className="text-center text-gray-500">Tu carrito está vacío.</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                            {item.image && (
                                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
                                <p className="text-sm font-semibold">Subtotal: ${item.price * item.quantity}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        aria-label="Disminuir cantidad"
                                        className="p-1 rounded hover:bg-gray-100"
                                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        tabIndex={0}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button
                                        aria-label="Aumentar cantidad"
                                        className="p-1 rounded hover:bg-gray-100"
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        tabIndex={0}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                        aria-label="Eliminar producto"
                                        className="ml-2 p-1 rounded hover:bg-red-100 text-red-600"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        tabIndex={0}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t space-y-3">
                <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${total}</span>
                </div>
                <button
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                    onClick={handleClearCart}
                    aria-label="Vaciar carrito"
                    disabled={loading || items.length === 0}
                >
                    Vaciar carrito
                </button>
                <button
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                    aria-label="Finalizar compra"
                    disabled={items.length === 0}
                >
                    Finalizar compra
                </button>
            </div>
        </div>
    );
};

export default CartSidebar; 