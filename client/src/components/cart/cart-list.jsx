import React, { useEffect } from 'react';
import cartStore from "../../store/CartStore.js";
import CartSubmitButton from "./CartSubmitButton.jsx";
import NoData from "../layout/no-data.jsx";
import CartSkeleton from "../../skeleton/cart-skeleton.jsx";

const sizePriceMap = { Small: 0, Medium: 50, Large: 100 };
const potColorPriceMap = { Default: 0, White: 30, Metallic: 60 };

const calculateDepreciatedPrice = (basePrice, createdAt, ratePerMonth = 0.02) => {
    const diffDays = (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
    const dailyRate = 1 - Math.pow(1 - ratePerMonth, 1 / 30);
    return Math.max(basePrice * Math.pow(1 - dailyRate, diffDays), 1);
};

const CartList = () => {
    const { CartListRequest, CartList, CreateInvoiceRequest, RemoveCartListRequest } = cartStore();
    const [CartTotal, setCartTotal] = React.useState(0);
    const [CartVatTotal, setCartVatTotal] = React.useState(0);
    const [CartPayableTotal, setCartPayableTotal] = React.useState(0);

    useEffect(() => { (async () => { await CartListRequest(); })(); }, []);

    // Recalculate totals whenever CartList changes
    useEffect(() => {
        if (!CartList) return;
        let total = 0;
        CartList.forEach(item => {
            const basePrice = item.product.discount ? Number(item.product.discountPrice) : Number(item.product.price);
            const depreciatedBase = calculateDepreciatedPrice(basePrice, item.product.createdAt);
            const extraSizePrice = sizePriceMap[item.plantSize] || 0;
            const extraColorPrice = potColorPriceMap[item.potColor] || 0;
            const finalUnitPrice = Math.round(depreciatedBase + extraSizePrice + extraColorPrice);
            total += finalUnitPrice * item.qty;
        });
        const vat = Math.round(total * 0.05);
        const payable = total + vat;

        setCartTotal(Math.round(total));
        setCartVatTotal(vat);
        setCartPayableTotal(payable);
    }, [CartList]);

    const remove = async (cartID) => {
        await RemoveCartListRequest({ _id: cartID });
        await CartListRequest();
    };

    if (CartList == null) return <CartSkeleton />;
    if (CartList.length === 0) return <NoData />;

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-12">
                    <div className="card p-4">
                        <ul className="list-group list-group-flush">
                            {CartList.map((item, i) => {
                                const basePrice = item.product.discount ? Number(item.product.discountPrice) : Number(item.product.price);
                                const depreciatedBase = calculateDepreciatedPrice(basePrice, item.product.createdAt);
                                const extraSizePrice = sizePriceMap[item.plantSize] || 0;
                                const extraColorPrice = potColorPriceMap[item.potColor] || 0;
                                const finalUnitPrice = Math.round(depreciatedBase + extraSizePrice + extraColorPrice);

                                return (
                                    <li key={item._id} className="list-group-item d-flex justify-content-between align-items-start">
                                        <img className="rounded-1" width="90" height="auto" src={item.product.image} />
                                        <div className="ms-2 me-auto">
                                            <p className="fw-lighter m-0">{item.product.title}</p>
                                            <p className="fw-lighter my-1">
                                                Unit Price: ৳{finalUnitPrice}, Qty: {item.qty}, Size: {item.plantSize || "N/A"}, Color: {item.potColor || "N/A"}
                                            </p>
                                            <p className="h6 fw-bold m-0 text-dark">
                                                Total ৳{Math.round(finalUnitPrice * item.qty)}
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
                                            onClick={async (e) => { e.preventDefault(); await CreateInvoiceRequest(); }}
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
};

export default CartList;
