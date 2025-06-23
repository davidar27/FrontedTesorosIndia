import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard, MapPin } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

type CartSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    isClosing: boolean;
    scrolled: boolean;
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
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const [, setIsRendered] = useState(false);
    const [isClosing, setIsClosing] = useState(false);


    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setIsClosing(false);
        } else {
            setIsClosing(true);
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (isClosing) {
            setIsRendered(false);
        }
    };

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    return (
        <>
            {/* Sidebar */}
            <aside
                onAnimationEnd={handleAnimationEnd}
                className={`fixed right-0 z-40 w-80 lg:w-96 h-full transition-all duration-300 bg-gradient-to-br from-white via-white to-green-50/30 border-l border-green-100 shadow-2xl shadow-green-900/10 ${!isClosing ? `animate-fade-in-right` : `animate-slide-out-right`}`}
                style={{
                    top: scrolled ? '70px' : '90px',
                    height: `calc(100vh - ${scrolled ? '70px' : '90px'})`
                }}
                role="complementary"
                aria-label="Carrito de compras"
                tabIndex={0}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Mi Carrito</h2>
                                <p className="text-emerald-100 text-sm">
                                    {items.length} {items.length === 1 ? 'tesoro' : 'tesoros'} seleccionados
                                </p>
                            </div>
                        </div>
                        <button
                            aria-label="Cerrar carrito"
                            onClick={handleClose}
                            className="p-2 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Items Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tu carrito está vacío</h3>
                            <p className="text-gray-500 text-sm">
                                Descubre los tesoros únicos que Colombia tiene para ofrecerte
                            </p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Product Image */}
                                    <div className="relative">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-xl shadow-md"
                                            />
                                        )}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{item.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">{item.name}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">Tesoro colombiano</span>
                                        </div>

                                        {/* Price Info */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium text-emerald-600">${item.price.toLocaleString()}</span>
                                                <span className="text-gray-400"> × {item.quantity}</span>
                                            </div>
                                            <div className="text-lg font-bold text-gray-800">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                                <button
                                                    aria-label="Disminuir cantidad"
                                                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                                                    onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    tabIndex={0}
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="px-3 py-1 font-medium text-gray-800 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    aria-label="Aumentar cantidad"
                                                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    tabIndex={0}
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>

                                            <button
                                                aria-label="Eliminar producto"
                                                className="p-2 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200 group"
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                tabIndex={0}
                                            >
                                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 p-6 space-y-4">
                    {/* Total */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Total a pagar:</span>
                            <span className="text-2xl font-bold text-emerald-600">
                                ${total.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Incluye todos los impuestos</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            aria-label="Finalizar compra"
                            disabled={items.length === 0 || loading}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                <span>Finalizar Compra</span>
                            </div>
                        </button>

                        {items.length > 0 && (
                            <button
                                className="group w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                onClick={handleClearCart}
                                aria-label="Vaciar carrito"
                                disabled={loading}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Vaciar Carrito</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default CartSidebar;