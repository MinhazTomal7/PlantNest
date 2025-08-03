import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Chatbot() {
    const [input, setInput] = useState("");
    const [chatLog, setChatLog] = useState([{ sender: "Bot", message: "Hi! I’m your PlantNest assistant 🌿. How can I help you today?" }]);
    const messagesEndRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "You", message: input };
        setChatLog((prev) => [...prev, userMessage]);

        try {
            const res = await axios.post("http://127.0.0.1:5000/chat", { message: input });
            const botMessage = { sender: "Bot", message: res.data.response };
            setChatLog((prev) => [...prev, botMessage]);
        } catch (error) {
            setChatLog((prev) => [...prev, { sender: "Bot", message: "Sorry, I’m offline right now." }]);
        }

        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog]);

    return (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", height: "100%" }}>
            <h3 style={{ textAlign: "center", color: "#2e7d32", marginBottom: 8 }}>🌱 NestBot</h3>
            <div
                style={{
                    flex: 1,
                    padding: "10px",
                    background: "#f1f1f1",
                    borderRadius: 8,
                    overflowY: "auto",
                    marginBottom: 10,
                }}
            >
                {chatLog.map((chat, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            justifyContent: chat.sender === "You" ? "flex-end" : "flex-start",
                            marginBottom: 6,
                        }}
                    >
                        <div
                            style={{
                                maxWidth: "75%",
                                padding: "10px 14px",
                                borderRadius: 20,
                                background: chat.sender === "You" ? "#a5d6a7" : "#ffffff",
                                color: "#333",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                animation: "fadeIn 0.2s ease",
                            }}
                        >
                            <div style={{ fontSize: 14 }}>{chat.message}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <input
                type="text"
                placeholder="Ask me about plants..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 20,
                    padding: "10px 16px",
                    fontSize: 14,
                    width: "100%",
                    marginBottom: 6,
                }}
            />
            <button
                onClick={sendMessage}
                style={{
                    backgroundColor: "#2e7d32",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px",
                    fontSize: 14,
                    cursor: "pointer",
                }}
            >
                Send
            </button>
        </div>
    );
}
