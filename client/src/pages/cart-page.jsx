import React from 'react';
import CartList from "../components/cart/cart-list.jsx";
import Brands from "../components/product/brands.jsx";

const CartPage = () => {
    return (
        <div>
            <CartList/>
            <Brands/>
        </div>
    );
};

export default CartPage;