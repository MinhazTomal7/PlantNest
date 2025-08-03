// src/components/ui/card.jsx
import React from 'react';

export function Card({ children, className }) {
    return (
        <div className={`p-4 bg-white rounded-lg shadow ${className || ''}`}>
            {children}
        </div>
    );
}

export function CardContent({ children }) {
    return <div className="mt-2">{children}</div>;
}
