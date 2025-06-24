import Picture from "@/components/ui/display/Picture";
import Input from "@/components/ui/inputs/Input";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { Minus, Plus, Trash2, ShoppingCart, MapPin, Sparkles, CreditCard, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { MercadoPagoCheckoutBrick } from "@/components/payments/MercadoPagoCheckoutBrick";

const CartPage: React.FC = () => {
    const {
        items,
        total,
        handleRemoveFromCart,
        handleUpdateQuantity,
        handleClearCart,
        loading,
    } = useCart();

    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState<string | null>(null);
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [showBrick, setShowBrick] = useState(false);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const finalTotal = total + total * 0.19;

    const handlePay = async () => {
        setPaying(true);
        setPayError(null);
        try {
            const payload = {
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.priceWithTax,
                })),
                total: finalTotal,
            };
            const { data } = await axiosInstance.post("/pagos/preferencia", payload);
            if (data && data.preferenceId) {
                setPreferenceId(data.preferenceId);
                setShowBrick(true);
            } else {
                setPayError("No se pudo obtener la preferencia de pago.");
            }
        } catch (err: unknown) {
            let message = "Error al iniciar el pago. Intenta nuevamente.";
            if (
                err &&
                typeof err === "object" &&
                "response" in err &&
                err.response &&
                typeof err.response === "object" &&
                "data" in err.response &&
                err.response.data &&
                typeof err.response.data === "object" &&
                "message" in err.response.data
            ) {
                message = String((err.response as { data?: { message?: string } }).data?.message);
            }
            setPayError(message);
        } finally {
            setPaying(false);
        }
    };

    return (
        <main className="relative z-20 responsive-padding-y bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 ">
            {items.length === 0 ? (
                // Empty Cart State
                <div className="text-center py-16 px-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        ¡Explora nuestros increíbles productos y experiencias para comenzar tu aventura!
                    </p>
                    <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5" />
                            <span>Explorar Productos</span>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="p-8 md:p-12 flex gap-4">
                    {/* Cart Items */}
                    <section className="w-full">
                        <div className="flex items-center gap-3 mb-6 bg-white rounded-2xl p-4">
                            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Productos Seleccionados</h2>
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <Picture
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-lg"
                                                />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                                                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Producto Colombiano</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-emerald-600">
                                                        {formatPrice(item.priceWithTax)}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                                        <button
                                                            aria-label="Disminuir cantidad"
                                                            className="w-10 h-10 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                                                            onClick={() => handleUpdateQuantity({ ...item, quantity: Math.max(1, item.quantity - 1) })}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>

                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleUpdateQuantity({
                                                                    ...item,
                                                                    quantity: parseInt(e.target.value) || 1,
                                                                })
                                                            }
                                                            className="!w-16 bg-transparent border-none !shadow-none hover:bg-gray-50 !p-2 !text-center font-semibold text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                                                            inputSize="sm"
                                                            aria-valuemax={item.stock}
                                                            aria-valuemin={1}
                                                        />

                                                        <button
                                                            aria-label="Aumentar cantidad"
                                                            className="w-10 h-10 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                                                            onClick={() => handleUpdateQuantity({ ...item, quantity: item.quantity + 1 })}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        aria-label="Eliminar producto"
                                                        className="w-12 h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                                                        onClick={() => handleRemoveFromCart(item)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Order Summary */}
                    <aside className="sticky top-20 group bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Resumen de tu Compra</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center py-3 border-b border-emerald-200">
                                <span className="text-gray-700 font-medium">Cantidad de Productos:</span>
                                <span className="text-xl font-bold text-emerald-600">{totalItems}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-emerald-200">
                                <span className="text-gray-700 font-medium">Subtotal:</span>
                                <span className="text-xl font-semibold text-gray-800">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-emerald-200">
                                <span className="text-gray-700 font-medium">IVA (19%):</span>
                                <span className="text-xl font-semibold text-gray-800">{formatPrice(total * 0.19)}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 bg-white rounded-2xl px-6 shadow-sm">
                                <span className="text-2xl font-bold text-gray-800">Total:</span>
                                <span className="text-3xl font-bold text-emerald-600">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
                                aria-label="Continuar Compra"
                                disabled={items.length === 0 || paying}
                                onClick={handlePay}
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    {paying ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                    )}
                                    <span>{paying ? 'Preparando pago...' : 'Continuar Compra'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </button>

                            <button
                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
                                onClick={handleClearCart}
                                aria-label="Vaciar carrito"
                                disabled={loading || items.length === 0}
                            >
                                <div className="flex items-center space-x-3">
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                    )}
                                    <span>{loading ? 'Vaciando...' : 'Vaciar Carrito'}</span>
                                </div>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-6 pt-6 border-t border-emerald-200">
                            <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span>Productos 100% Colombianos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span>Envío Seguro</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span>Garantía de Calidad</span>
                                </div>
                            </div>
                        </div>

                        {payError && (
                            <div className="mt-4 text-red-600 text-center font-semibold">
                                {payError}
                            </div>
                        )}
                    </aside>
                </div>
            )}

            {/* Modal para el Brick de Mercado Pago */}
            {showBrick && preferenceId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                            onClick={() => setShowBrick(false)}
                            aria-label="Cerrar modal"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center text-emerald-700">Paga con Mercado Pago</h2>
                        <MercadoPagoCheckoutBrick preferenceId={preferenceId} />
                    </div>
                </div>
            )}
        </main>
    );
};

export default CartPage;