import React, { useState, useRef, useEffect } from 'react';
import { Send, X, ArrowLeft } from 'lucide-react';
import IATesorito from '@/assets/icons/IATesorito.webp';
import ChatMessage from '@/features/chatbot/ChatMessage';
import ChatbotNotification from '@/features/chatbot/ChatbotNotification';
import { ChatbotProvider, useChatbot } from '@/features/chatbot/ChatbotContext';
import ChatbotOptions from '@/features/chatbot/components/ChatbotOptions';
import ChatbotProductCards from '@/features/chatbot/components/ChatbotProductCards';
import ChatbotItemCards from '@/features/chatbot/components/ChatbotItemCards';
import IntentRedirectButton from '@/features/chatbot/components/IntentRedirectButton';
import GuidedContentInChat from '@/features/chatbot/components/GuidedContentInChat';
import Picture from '../../components/ui/display/Picture';
import './styles/responseCards.css';

interface ChatbotProps {
    className?: string;
}

const ChatbotComponent: React.FC<ChatbotProps> = ({ className = '' }) => {
    const {
        isOpen,
        toggleChat,
        messages,
        sendMessage,
        isLoading,
        currentMenu,
        chatbotState,
        currentProducts,
        currentExperiences,
        currentPackages,
        currentCategories,
        detectedIntent,
        showGuidedContent,
        guidedContentType,
        handleOptionClick,
        handleProductClick,
        handleExperienceClick,
        handlePackageClick,
        handleCategoryClick,
        handleIntentRedirect,
        hideGuidedContent,
        goBack,
        backToCategories
    } = useChatbot();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
        
        if (isOpen /* && isMobile */) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        } else if (!isOpen /* && isMobile */) {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        return () => {
            if (isMobile) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current && chatbotState.currentMenu === 'free_chat') {
            inputRef.current.focus();
        }
    }, [isOpen, chatbotState.currentMenu]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Prevenir scroll del body cuando se hace touch en el chat (solo en móviles)
    const handleTouchStart = (e: React.TouchEvent) => {
        // Solo aplicar en móviles
        if (window.innerWidth <= 768 || ('ontouchstart' in window)) {
            e.stopPropagation();
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (window.innerWidth <= 768 || ('ontouchstart' in window)) {
            const target = e.target as HTMLElement;
            const messagesContainer = target.closest('.chatbot-messages');
            
            if (!messagesContainer) {
                e.preventDefault();
            }
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 chatbot-container ${className}`}>
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="mb-4 w-80 h-115 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden backdrop-blur-sm bg-white/95 chatbot-window"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white p-4 flex items-center justify-between relative overflow-hidden chatbot-header">
                        {/* Efecto decorativo de fondo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 backdrop-blur-sm"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>

                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="relative">
                                <Picture src={IATesorito} alt="Tesoros India" className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-base tracking-wide drop-shadow-sm">Tesorito</h3>
                                <p className="text-xs text-white/90 font-medium">Guía turístico virtual</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 relative z-10">
                            {/* Botón para volver al menú cuando está en chat libre */}
                            {chatbotState.currentMenu === 'free_chat' && (
                                <button
                                    onClick={() => goBack()}
                                    className="text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 p-2 rounded-lg"
                                    title="Volver a las opciones guiadas"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            )}
                            
                        <button
                            onClick={toggleChat}
                                className="text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 p-2 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white chatbot-messages">
                        {/* Breadcrumb */}
                        {chatbotState.breadcrumb.length > 1 && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                                {chatbotState.breadcrumb.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <span className="text-gray-400">→</span>}
                                        <span className={index === chatbotState.breadcrumb.length - 1 ? 'font-semibold text-gray-800' : 'text-gray-600'}>
                                            {item}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Menú de opciones */}
                        {currentMenu && (
                            <div className="space-y-4">
                                <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-base mb-2">
                                        {currentMenu.title}
                                    </h3>
                                    <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
                                </div>
                                <ChatbotOptions
                                    options={currentMenu.options}
                                    onOptionClick={handleOptionClick}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}

                        {/* Productos en cards */}
                        {chatbotState.currentMenu === 'products_display' && currentProducts.length > 0 && (
                            <div className="space-y-4">
                                <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-base mb-2">
                                        Productos Disponibles
                                    </h3>
                                    <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
                                </div>
                                <ChatbotProductCards
                                    products={currentProducts}
                                    onProductClick={handleProductClick}
                                />
                                <button
                                    onClick={() => goBack()}
                                    className="w-full p-3 text-center rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md hover:border-gray-300"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Volver al menú principal</span>
                                </button>
                            </div>
                        )}

                        {/* Experiencias en cards */}
                        {chatbotState.currentMenu === 'experiences_display' && currentExperiences.length > 0 && (
                            <div className="space-y-4">
                                <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-base mb-2">
                                        Experiencias Culturales
                                    </h3>
                                    <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
                                </div>
                                <ChatbotItemCards
                                    items={currentExperiences}
                                    onItemClick={(item) => {
                                        if ('location' in item) {
                                            handleExperienceClick(item);
                                        }
                                    }}
                                    type="experience"
                                />
                                <button
                                    onClick={() => goBack()}
                                    className="w-full p-3 text-center rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md hover:border-gray-300"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Volver al menú principal</span>
                                </button>
                            </div>
                        )}

                        {/* Paquetes en cards */}
                        {chatbotState.currentMenu === 'packages_display' && currentPackages.length > 0 && (
                            <div className="space-y-4">
                                <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-base mb-2">
                                        Paquetes Turísticos
                                    </h3>
                                    <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
                                </div>
                                <ChatbotItemCards
                                    items={currentPackages}
                                    onItemClick={(item) => {
                                        if ('duration' in item) {
                                            handlePackageClick(item);
                                        }
                                    }}
                                    type="package"
                                />
                                <button
                                    onClick={() => goBack()}
                                    className="w-full p-3 text-center rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md hover:border-gray-300"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Volver al menú principal</span>
                                </button>
                            </div>
                        )}

                        {/* Mensajes del chat */}
                        {messages.length > 0 && (
                            <div className="space-y-3">
                                {messages.map((message, index) => (
                                <ChatMessage key={index} message={message} />
                                ))}
                                
                                {/* Botón de redirección de intención */}
                                {detectedIntent && (
                                    <>
                                        <IntentRedirectButton
                                            message={detectedIntent.message}
                                            buttonText={detectedIntent.buttonText}
                                            onClick={() => handleIntentRedirect(detectedIntent.redirectTo)}
                                            isLoading={isLoading}
                                        />
                                    </>
                                )}

                                {/* Contenido guiado dentro del chat */}
                                {showGuidedContent && guidedContentType && (
                                    <GuidedContentInChat
                                        type={guidedContentType}
                                        products={currentProducts}
                                        experiences={currentExperiences}
                                        packages={currentPackages}
                                        categories={currentCategories}
                                        onProductClick={handleProductClick}
                                        onExperienceClick={handleExperienceClick}
                                        onPackageClick={handlePackageClick}
                                        onCategoryClick={handleCategoryClick}
                                        onBackToChat={hideGuidedContent}
                                        onBackToCategories={backToCategories}
                                    />
                                )}
                            </div>
                        )}

                        {/* Mensaje informativo para chat libre */}
                        {chatbotState.currentMenu === 'free_chat' && messages.length === 0 && (
                            <div className="space-y-4">
                                <div className="text-center py-6 text-gray-500">
                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
                                        <div className="text-4xl mb-3">💬</div>
                                        <h3 className="font-bold text-gray-800 text-base mb-2">
                                            Chat Libre Activado
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Ahora puedes escribir libremente y hacer cualquier pregunta a Tesorito
                                        </p>
                                        <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
                                    </div>
                                </div>
                                
                                {/* Botón para volver al menú principal */}
                                <button
                                    onClick={() => goBack()}
                                    className="w-full p-3 text-center rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md hover:border-gray-300"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Volver al menú principal</span>
                                </button>
                            </div>
                        )}



                        {/* Estado de carga */}
                        {isLoading && (
                            <div className="flex items-center justify-center space-x-3 text-gray-500 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-sm font-medium">Tesorito está escribiendo...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input - Solo visible en chat libre, NO cuando hay contenido guiado */}
                    {chatbotState.currentMenu === 'free_chat' && !showGuidedContent && (
                        <form 
                            onSubmit={handleSubmit} 
                            className="p-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm chatbot-input-area"
                        >
                            <div className="flex space-x-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                disabled={isLoading}
                                className="flex-1 px-2 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm disabled:opacity-50 bg-white/80 backdrop-blur-sm placeholder-gray-500 transition-all duration-200 chatbot-input"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 chatbot-button"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative group overflow-hidden"
                >
                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative">
                        <Picture src={IATesorito} alt="Tesoros India" className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>

                    <ChatbotNotification />
                </button>
            )}
        </div>
    );
};

// Wrapper component that provides the context
const Chatbot: React.FC<ChatbotProps> = (props) => {
    return (
        <ChatbotProvider>
            <ChatbotComponent {...props} />
        </ChatbotProvider>
    );
};

export default Chatbot; 