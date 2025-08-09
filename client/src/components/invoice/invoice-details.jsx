import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import cartStore from "../../store/CartStore.js";
import NoData from "../layout/no-data.jsx";
import CartSkeleton from "../../skeleton/cart-skeleton.jsx";
import { Modal } from "react-bootstrap";
import ReviewStore from "../../store/ReviewStore.js";
import ValidationHelper from "../../utility/ValidationHelper.js";
import toast from "react-hot-toast";
import ReviewSubmitButton from "./ReviewSubmitButton.jsx";

const InvoiceDetails = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const { ReviewFormData, ReviewFormOnChange, ReviewSaveRequest } = ReviewStore();
    const ReviewModal = (id) => {
        setShow(true);
        ReviewFormOnChange('productID', id);
    };

    const { id } = useParams();
    const { InvoiceDetails, InvoiceDetailsRequest } = cartStore();

    // Price maps matching backend
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

    const ratePerMonth = 0.02; // 2% monthly depreciation

    // Calculate depreciated price with daily compounding
    const calculateDepreciatedPrice = (basePrice, createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();

        const diffTime = now - createdDate; // milliseconds
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        const dailyRate = 1 - Math.pow(1 - ratePerMonth, 1 / 30);

        const depreciatedPrice = basePrice * Math.pow(1 - dailyRate, diffDays);

        return Math.max(Math.round(depreciatedPrice), 1);
    };

    useEffect(() => {
        (async () => {
            await InvoiceDetailsRequest(id);
        })();
    }, [id]);

    const submitReview = async () => {
        if (ValidationHelper.IsEmpty(ReviewFormData.des)) {
            toast.error("Review Required");
            return;
        }
        let res = await ReviewSaveRequest(ReviewFormData);
        if (res) {
            toast.success("New Review Created");
        } else {
            toast.error("Something Went Wrong!");
        }
        setShow(false);
    };

    if (InvoiceDetails == null) {
        return <CartSkeleton />;
    } else if (InvoiceDetails.length === 0) {
        return <NoData />;
    } else {
        // Calculate subtotal for all items
        const subtotal = InvoiceDetails.reduce((acc, item) => {
            const basePrice = item.product.discount
                ? Number(item.product.discountPrice)
                : Number(item.product.price);

            const depreciatedPrice = calculateDepreciatedPrice(basePrice, item.product.createdAt);

            const extraSize = sizePriceMap[item.plantSize] || 0;
            const extraColor = potColorPriceMap[item.potColor] || 0;

            const unitPrice = depreciatedPrice + extraSize + extraColor;

            return acc + unitPrice * parseInt(item.qty);
        }, 0);

        const vat = Math.ceil(subtotal * 0.05); // 5% VAT
        const payable = subtotal + vat;

        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card p-4">
                            <ul className="list-group list-group-flush">
                                {InvoiceDetails.map((item, i) => {
                                    const basePrice = item.product.discount
                                        ? Number(item.product.discountPrice)
                                        : Number(item.product.price);

                                    const depreciatedPrice = calculateDepreciatedPrice(basePrice, item.product.createdAt);

                                    const extraSize = sizePriceMap[item.plantSize] || 0;
                                    const extraColor = potColorPriceMap[item.potColor] || 0;

                                    const unitPrice = depreciatedPrice + extraSize + extraColor;

                                    const totalPrice = unitPrice * parseInt(item.qty);

                                    return (
                                        <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-medium h6">{item.product.title}</div>
                                                <span>Total: ৳{payable}</span> <br />
                                                <span>
                          Unit Price: ৳{unitPrice} <br />
                          Qty: {item.qty} <br />
                          Plant Size: {item.plantSize || "N/A"} <br />
                          Pot Color: {item.potColor || "N/A"}
                        </span>
                                            </div>
                                            <button onClick={() => ReviewModal(item.productID)} className="btn btn-success">
                                                Create Review
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <h6>Create Review</h6>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 p-2">
                                    <label className="form-label">Rating</label>
                                    <select
                                        onChange={(e) => ReviewFormOnChange('rating', e.target.value)}
                                        className="form-select"
                                        defaultValue="5"
                                    >
                                        <option value="5">5 Star</option>
                                        <option value="4">4 Star</option>
                                        <option value="3">3 Star</option>
                                        <option value="2">2 Star</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                                <div className="col-12 p-2">
                                    <label className="form-label">Review</label>
                                    <textarea
                                        onChange={(e) => ReviewFormOnChange('des', e.target.value)}
                                        className="form-control"
                                        rows={7}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-dark" onClick={handleClose}>Close</button>
                        <ReviewSubmitButton text="Submit" className="btn btn-success" onClick={submitReview} />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};

export default InvoiceDetails;
