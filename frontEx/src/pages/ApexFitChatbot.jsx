/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Bot,
  Dumbbell,
  Heart,
  Clock,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import chatService from "../services/chatService";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import formatChatbotResponse from "../util/formatChatbotResponse";

const ApexFitChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy ApexFit, tu asistente personal de fitness. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      isTyping: false,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const ventajas = [
    {
      id: 1,
      titulo: "Planificación Personalizada",
      texto: "Desde perder peso hasta ganar masa muscular.",
      icono: <Target className="text-blue-500" size={24} />,
    },
    {
      id: 2,
      titulo: "Ajuste Continuo",
      texto:
        "Tu progreso es dinámico, y tu plan también. ApexFit ajusta tu rutina semanalmente.",
      icono: <TrendingUp className="text-green-500" size={24} />,
    },
    {
      id: 3,
      titulo: "Soporte Motivacional",
      texto:
        "Recibe mensajes de ánimo, recordatorios y celebra contigo cada logro",
      icono: <Heart className="text-red-500" size={24} />,
    },
    {
      id: 4,
      titulo: "Respuestas Instantáneas",
      texto:
        "¿Una duda sobre un ejercicio? ¿Necesitas alternativas? Pregunta en tiempo real.",
      icono: <Clock className="text-yellow-500" size={24} />,
    },
    {
      id: 5,
      titulo: "Integración de Hábitos",
      texto:
        "Consejos de nutrición, hidratación y descanso para un enfoque integral.",
      icono: <Dumbbell className="text-purple-500" size={24} />,
    },
    {
      id: 6,
      titulo: "Para Todos los Niveles",
      texto:
        "ApexFit está diseñado para acompañar a cualquier persona que quiera mejorar su salud y fitness.",
      icono: <Users className="text-indigo-500" size={24} />,
    },
  ];

  const chatbotRef = useRef(null);
  const dragRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e) => {
    if (dragRef.current && dragRef.current.contains(e.target)) {
      setIsDragging(true);
      const rect = chatbotRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Limitar dentro de la ventana
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 500;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Efecto de escritura progresiva
  const typeText = (text, messageId, speed = 20) => {
    let i = 0;
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const timer = setInterval(() => {
      if (i < text.length) {
        const newMessages = [...messages];
        newMessages[messageIndex].text = text.substring(0, i + 1);
        newMessages[messageIndex].isTyping = true;
        setMessages(newMessages);
        i++;
      } else {
        const newMessages = [...messages];
        newMessages[messageIndex].isTyping = false;
        setMessages(newMessages);
        clearInterval(timer);
      }
    }, speed);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        isTyping: false,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      // Crear mensaje de carga
      const loadingMessage = {
        id: Date.now() + 1,
        text: "",
        sender: "bot",
        isTyping: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const response = await chatService(userMessage.text);

        // Reemplazar el mensaje de carga con la respuesta real
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, text: response, isTyping: true }
              : msg
          )
        );

        // Iniciar efecto de escritura
        typeText(response, loadingMessage.id);
      } catch (err) {
        console.log(err.message);
        const errorMessage =
          "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, text: errorMessage, isTyping: false }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 300);
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-10"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div
          ref={chatbotRef}
          className={`fixed bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden ${
            isMinimized ? "w-80 h-12" : "w-96 h-[500px]"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? "grabbing" : "default",
            zIndex: 1000,
          }}
        >
          <div
            ref={dragRef}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-t-xl cursor-grab active:cursor-grabbing flex items-center justify-between"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-semibold">ApexFit Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-600 p-1 rounded transition-colors"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-purple-700 p-1 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-[calc(100%-112px)] overflow-y-auto bg-gray-50 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {message.sender === "bot" && message.isTyping && (
                          <div className="flex space-x-1 mb-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        )}
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                          {formatChatbotResponse(
                            message.text
                              .replace(/<br\s*\/?>/gi, "\n")
                              .replace(/\\n/g, "\n")
                          )}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white rounded-b-xl">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Bienvenido a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              ApexFit
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revoluciona tu bienestar con entrenamiento personalizado y
            acompañamiento 24/7
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 mb-12">
          <p className="text-gray-700 mb-4 text-lg">
            ¿Cansad@ de rutinas aburridas, dietas confusas y no saber por dónde
            empezar? ¡Llegó la revolución de tu bienestar! ApexFit es tu
            compañero de entrenamiento personalizado, disponible 24/7
            directamente en tu chat.
          </p>
          <p className="text-gray-700 mb-4 text-lg">
            ApexFit es un chatbot avanzado de inteligencia artificial diseñado
            para crear planes de entrenamiento y nutrición 100% personalizados
            para ti. Adaptándose a tus objetivos, nivel de condición física,
            tiempo disponible y equipamiento, te guía paso a paso hacia la mejor
            versión de ti mismo.
          </p>
          <p className="text-gray-700 text-lg">
            ¿Cómo empezar? Es simple. ¡Solo inicia una conversación! Cuéntale a
            ApexFit tus metas y deja que elabore el plan perfecto para ti.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          ¿Por qué elegir ApexFit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventajas.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-50 mr-3">
                  {item.icono}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.titulo}
                </h3>
              </div>
              <p className="text-gray-600">{item.texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 300);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Comienza tu conversación con ApexFit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApexFitChatbot;
