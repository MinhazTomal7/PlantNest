import React, { useState } from "react";
import Chatbot from "./Chatbot";

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [firstTimeOpened, setFirstTimeOpened] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
        if (!firstTimeOpened) setFirstTimeOpened(true);
    };

    return (
        <>
            {/* Floating Circular Button */}
            <button
                onClick={handleToggle}
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "none",
                    background: "linear-gradient(135deg, #4CAF50, #81C784)",
                    color: "white",
                    fontSize: 28,
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                    transition: "transform 0.2s ease",
                }}
                aria-label={open ? "Close chat" : "Open chat"}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                {open ? "×" : "💬"}
            </button>

            {/* Chat Container */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 100,
                        right: 24,
                        width: 360,
                        maxHeight: 520,
                        height: "85vh",
                        borderRadius: "20px",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                        backgroundColor: "#ffffff",
                        zIndex: 9999,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        animation: "fadeInUp 0.3s ease",
                    }}
                >
                    <Chatbot greetOnMount={firstTimeOpened} />
                </div>
            )}

            {/* Optional animation keyframes */}
            <style>
                {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </>
    );
}
