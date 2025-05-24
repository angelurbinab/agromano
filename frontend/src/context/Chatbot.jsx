import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

/**
 * @description Componente de chatbot que permite a los usuarios interactuar enviando mensajes y recibiendo respuestas.
 * @returns {JSX.Element} Interfaz del chatbot.
 */
function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  /**
   * @description Envía el mensaje del usuario al backend y actualiza la conversación.
   */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", { message: input });
      const botMessage = { role: "assistant", content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      const errorMessage = { role: "assistant", content: "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo más tarde." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-wrapper">
      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <span>¿En que puedo ayudarte?</span>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <img src="/chat-icon.png" alt="Chatbot" />
      </button>
    </div>
  );
}

export default Chatbot;
