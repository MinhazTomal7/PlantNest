import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Public pages (with Layout)
import Layout from "./components/layout/layout.jsx";
import HomePage from "./pages/home-page.jsx";
import ProductByBrand from "./pages/product-by-brand.jsx";
import ProductByCategory from "./pages/product-by-category.jsx";
import ProductByKeyword from "./pages/product-by-keyword.jsx";
import ProductDetails from "./pages/product-details.jsx";
import AboutPage from "./pages/about-page.jsx";
import RefundPage from "./pages/refund-page.jsx";
import PrivacyPage from "./pages/privacy-page.jsx";
import TermsPage from "./pages/terms-page.jsx";
import HowToBuyPage from "./pages/how-to-buy-page.jsx";
import ContactPage from "./pages/contact-page.jsx";
import ComplainPage from "./pages/complain-page.jsx";
import LoginPage from "./pages/login-page.jsx";
import OtpPage from "./pages/otp-page.jsx";
import ProfileForm from "./components/user/Profile-Form.jsx";
import WishPage from "./pages/wish-page.jsx";
import CartPage from "./pages/cart-page.jsx";
import OrderPage from "./pages/order-page.jsx";
import InvoicePage from "./pages/invoice-page.jsx";

// Admin pages (NO layout)
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminOrders from "./admin/pages/AdminOrders.jsx";
import AdminProducts from "./admin/pages/AdminProducts.jsx";
import AdminLayout from "./admin/layout/AdminLayout.jsx";
import AddProduct from "./admin/pages/AddProduct.jsx";
import Chatbot from "./components/Chatbot.jsx";
import AdminProtected from "./admin/components/AdminProtected.jsx";

// ScrollToTop Component
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const App = () => {
    return (
        <BrowserRouter>
            {/* ScrollToTop ensures every page starts at the top */}
            <ScrollToTop />

            <Routes>
                {/* Public layout routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="by-brand/:id" element={<ProductByBrand />} />
                    <Route path="by-category/:id" element={<ProductByCategory />} />
                    <Route path="by-keyword/:keyword" element={<ProductByKeyword />} />
                    <Route path="details/:id" element={<ProductDetails />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="refund" element={<RefundPage />} />
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="terms" element={<TermsPage />} />
                    <Route path="how-to-buy" element={<HowToBuyPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="complain" element={<ComplainPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="otp" element={<OtpPage />} />
                    <Route path="profile" element={<ProfileForm />} />
                    <Route path="wish" element={<WishPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="orders" element={<OrderPage />} />
                    <Route path="/invoice/:id" element={<InvoicePage />} />
                    <Route path="chat" element={<Chatbot />} />
                </Route>

                {/* Admin route without layout */}
                <Route path="/admin" element={<AdminProtected />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="add-product" element={<AddProduct />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
