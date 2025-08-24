import React from 'react';
import ProductStore from "../../store/ProductStore.js";
import StarRatings from "react-star-ratings/build/star-ratings.js";
import { Link } from "react-router-dom";
import ProductsSkeleton from "../../skeleton/products-skeleton.jsx";

const Products = () => {
    const { ListByRemark, ListByRemarkRequest } = ProductStore();

    return (
        <div className="section">
            <div className="container-fluid py-5 bg-white">
                <div className="row">
                    <h1 className="headline-4 text-center my-2 p-0">Our Products</h1>
                    <span className="bodySmal mb-3 text-center d-block">
                        Explore a World of Choices Across Our Most Popular
                    </span>
                    <div className="col-12">
                        <div>
                            <ul className="nav nav-pills p-3 justify-content-center mb-3" id="pills-tab" role="tablist">
                                {["new", "trending", "popular", "top", "special"].map((remark, idx) => (
                                    <li key={idx} className="nav-item" role="presentation">
                                        <button
                                            onClick={() => ListByRemarkRequest(remark)}
                                            className={`nav-link ${idx === 0 ? "active" : ""}`}
                                            id={`pills-${remark}-tab`}
                                            data-bs-toggle="pill"
                                            data-bs-target={`#pills-${remark}`}
                                            type="button"
                                            role="tab"
                                            aria-controls={`pills-${remark}`}
                                            aria-selected={idx === 0 ? "true" : "false"}
                                        >
                                            {remark.charAt(0).toUpperCase() + remark.slice(1)}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="tab-content" id="pills-tabContent">
                                {["new", "trending", "popular", "top", "special"].map((remark, idx) => (
                                    <div
                                        key={idx}
                                        className={`tab-pane fade ${idx === 0 ? "show active" : ""}`}
                                        id={`pills-${remark}`}
                                        role="tabpanel"
                                        aria-labelledby={`pills-${remark}-tab`}
                                        tabIndex="0"
                                    >
                                        {ListByRemark === null ? (
                                            <ProductsSkeleton />
                                        ) : (
                                            <div className="container">
                                                <div className="row row-cols-2 row-cols-md-5 row-cols-lg-10 g-3">
                                                    {ListByRemark.map((item, i) => {
                                                        let price = (
                                                            <p className="bodyMedium text-dark my-1 text-start">
                                                                ৳{item.price}
                                                            </p>
                                                        );
                                                        if (item.discount) {
                                                            price = (
                                                                <p className="bodyMedium text-dark my-1 text-start">
                                                                    <strike>৳{item.price}</strike> ৳{item.discountPrice}
                                                                </p>
                                                            );
                                                        }

                                                        return (
                                                            <div key={i} className="col">
                                                                <Link
                                                                    to={`/details/${item._id}`}
                                                                    className="card h-100 rounded-3 bg-white text-decoration-none d-flex flex-column justify-content-start p-4"
                                                                    style={{
                                                                        textAlign: "left",
                                                                        boxShadow: "4px 4px 8px rgba(0,0,0,0.1)", // bottom-right shadow
                                                                        border: "none", // remove any border
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={item.img}
                                                                        alt={item.title}
                                                                        className="img-fluid mb-3"
                                                                        style={{ maxHeight: "140px", objectFit: "contain" }}
                                                                    />
                                                                    <p className="bodySmal mb-1 text-dark">{item.title}</p>
                                                                    {price}
                                                                    <StarRatings
                                                                        rating={parseFloat(item.star)}
                                                                        starRatedColor="red"
                                                                        starDimension="15px"
                                                                        starSpacing="2px"
                                                                    />
                                                                </Link>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
