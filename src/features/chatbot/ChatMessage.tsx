/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/features/chatbot/interfaces/IAInterfaces';
import EnrichedResponse from './components/EnrichedResponse';

interface ChatMessageProps {
    message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.sender === 'user';
    const formattedTime = message.timestamp.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Lógica para mostrar botón de informe PDF
    const pdfHtml = (message.data && Array.isArray(message.data) && message.data[0] && (message.data[0] as any).pdfHtml)
        ? (message.data[0] as any).pdfHtml
        : (message.data && (message.data as any).pdfHtml);

    const pdfUrl = (message.data && Array.isArray(message.data) && message.data[0] && (message.data[0] as any).pdfUrl)
        ? (message.data[0] as any).pdfUrl
        : (message.data && (message.data as any).pdfUrl);

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
            >
                {isUser ? (
                    // Mensaje del usuario - solo texto
                    <p className="text-sm leading-relaxed">{message.text}</p>
                ) : (
                    // Mensaje del bot - puede ser enriquecido
                    <EnrichedResponse response={message.text} />
                )}
                {pdfHtml && (
                    <div className="mt-3 flex flex-col items-center">
                        <button
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold shadow hover:bg-emerald-700 transition"
                            onClick={() => {
                                const newWindow = window.open();
                                if (newWindow) {
                                    newWindow.document.write(pdfHtml);
                                    newWindow.document.close();
                                }
                            }}
                        >
                            Ver informe PDF
                        </button>
                        <a
                            href={`data:text/html;charset=utf-8,${encodeURIComponent(pdfHtml)}`}
                            download="informe_tesoros_india.html"
                            className="mt-2 text-emerald-700 underline text-sm"
                        >
                            Descargar informe como HTML
                        </a>
                    </div>
                )}
                {pdfUrl && (
                    <div className="mt-3 flex flex-col items-center">
                        <a
                            href={pdfUrl}
                            download="informe_experiencia.pdf"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold shadow hover:bg-emerald-700 transition"
                        >
                            Descargar informe PDF
                        </a>
                    </div>
                )}
                <p
                    className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'
                        }`}
                >
                    {formattedTime}
                </p>
            </div>
        </div>
    );
};

export default ChatMessage; 