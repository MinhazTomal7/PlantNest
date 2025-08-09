import React, { useEffect } from 'react';
import cartStore from "../../store/CartStore.js";
import CartSubmitButton from "./CartSubmitButton.jsx";
import NoData from "../layout/no-data.jsx";
import CartSkeleton from "../../skeleton/cart-skeleton.jsx";

// Extra prices for size and pot color
const sizePriceMap = {
    Small: 0,
    Medium: 50,
    Large: 100,
};

const potColorPriceMap = {
    Default: 0,
    White: 30,
    Metallic: 60,
};

// Depreciation logic: 2% per month converted to daily compound
const calculateDepreciatedPrice = (basePrice, createdAt, ratePerMonth = 0.02) => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    // Calculate difference in days
    const diffTime = now - createdDate; // milliseconds
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Convert monthly rate to daily compound rate
    const dailyRate = 1 - Math.pow(1 - ratePerMonth, 1 / 30);

    // Calculate depreciated price with daily compounding
    const depreciatedPrice = basePrice * Math.pow(1 - dailyRate, diffDays);

    return Math.max(Math.round(depreciatedPrice), 1);
};

const CartList = () => {
    const {
        CartTotal,
        CartVatTotal,
        CartPayableTotal,
        CartListRequest,
        CartList,
        CreateInvoiceRequest,
        RemoveCartListRequest
    } = cartStore();

    useEffect(() => {
        (async () => {
            await CartListRequest();
        })();
    }, []);

    const remove = async (cartID) => {
        await RemoveCartListRequest(cartID);
        await CartListRequest();
    };

    if (CartList == null) {
        return <CartSkeleton />;
    } else if (CartList.length === 0) {
        return <NoData />;
    } else {
        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card p-4">
                            <ul className="list-group list-group-flush">
                                {CartList.map((item, i) => {
                                    const basePrice = item.product.discount
                                        ? Number(item.product.discountPrice)
                                        : Number(item.product.price);

                                    // Use the new daily-compounded depreciation function here
                                    const depreciatedBase = calculateDepreciatedPrice(basePrice, item.product.createdAt);

                                    const extraSizePrice = sizePriceMap[item.plantSize] || 0;
                                    const extraColorPrice = potColorPriceMap[item.potColor] || 0;

                                    const finalUnitPrice = Math.ceil(depreciatedBase + extraSizePrice + extraColorPrice);
                                    const totalPrice = Math.ceil(finalUnitPrice * parseInt(item.qty));


                                    return (
                                        <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                                            <img className="rounded-1" width="90" height="auto" src={item.product.image} />
                                            <div className="ms-2 me-auto">
                                                <p className="fw-lighter m-0">{item.product.title}</p>
                                                <p className="fw-lighter my-1">
                                                    Unit Price: ৳{finalUnitPrice}, Qty: {item.qty}, Size: {item.plantSize || "N/A"}, Color: {item.potColor || "N/A"}
                                                </p>
                                                <p className="h6 fw-bold m-0 text-dark">
                                                    Total ৳{Math.ceil(CartTotal / CartList.length)}
                                                </p>

                                            </div>
                                            <button onClick={() => remove(item._id)} className="btn btn-sm btn-outline-danger">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="my-4">
                                <ul className="list-group bg-transparent list-group-flush">
                                    <li className="list-group-item bg-transparent h6 m-0 text-dark">
                                        <span className="float-end">Total: ৳{CartTotal}</span>
                                    </li>
                                    <li className="list-group-item bg-transparent h6 m-0 text-dark">
                                        <span className="float-end">Vat(5%): ৳{CartVatTotal}</span>
                                    </li>
                                    <li className="list-group-item bg-transparent h6 m-0 text-dark">
                                        <span className="float-end">Payable: ৳{CartPayableTotal}</span>
                                    </li>
                                    <li className="list-group-item bg-transparent">
                                        <span className="float-end">
                                            <CartSubmitButton
                                                text="Check Out"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await CreateInvoiceRequest();
                                                }}
                                                className="btn px-5 mt-2 btn-success"
                                            />
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default CartList;
