import React from 'react';
import CartStore from "../../store/CartStore.js";
const CartSubmitButton = (props) => {
    let { isCartSubmit } = CartStore();

    if (!isCartSubmit) {
        return (
            <button
                onClick={props.onClick}
                type={props.type || "button"}   // <-- Ensure type is "button" by default
                className={props.className}
            >
                {props.text}
            </button>
        );
    } else {
        return (
            <button disabled className={props.className}>
                <div className="spinner-border spinner-border-sm" role="status"></div>Processing...
            </button>
        );
    }
};

export default CartSubmitButton;