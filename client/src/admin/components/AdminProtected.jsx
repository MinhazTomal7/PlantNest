import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import '../../assets/css/main.css'

const AdminProtected = () => {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isAdminLoggedIn") === "true");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "12345") {
            localStorage.setItem("isAdminLoggedIn", "true");
            setLoggedIn(true);
        } else {
            setError("Invalid username or password");
        }
    };

    if (!loggedIn) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <h2 className="admin-login-title">Admin Login</h2>
                    <form onSubmit={login} className="admin-login-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError("");
                            }}
                            required
                            autoFocus
                            className="admin-login-input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            required
                            className="admin-login-input"
                        />
                        {error && <p className="admin-login-error">{error}</p>}
                        <button type="submit" className="admin-login-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default AdminProtected;
