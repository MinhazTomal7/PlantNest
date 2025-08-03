import React from 'react';
import AppNavBar from "./appNavBar.jsx";
import Footer from "./footer.jsx";
import { Outlet } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import ChatbotWidget from "../ChatbotWidget.jsx";

const Layout = () => {
    return (
        <>
            <AppNavBar />
            <Outlet />
            <Toaster position="bottom-center"/>
            <Footer />
            <ChatbotWidget />
        </>
    );
};

export default Layout;
