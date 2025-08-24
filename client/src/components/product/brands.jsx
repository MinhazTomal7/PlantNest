import React, { useEffect } from 'react';
import ProductStore from "../../store/ProductStore.js";
import BrandsSkeleton from "../../skeleton/brands-skeleton.jsx";
import { Link } from "react-router-dom";

const Brands = () => {
    const { BrandList, BrandListRequest } = ProductStore();

    useEffect(() => {
        if (!BrandList || BrandList.length === 0) {
            BrandListRequest();
        }
    }, [BrandList, BrandListRequest]);

    if (!BrandList || BrandList.length === 0) {
        return <BrandsSkeleton />;
    }

    return (
        <div className="section">
            <div className="container">
                <h1 className="headline-4 text-center my-2 p-0">Top Brands</h1>
                <span className="bodySmal mb-5 text-center d-block">
          Explore a World of Choices Across Our Most Popular <br /> Shopping Categories
        </span>

                {/* Custom grid for exactly 7 columns on large screens */}
                <div
                    className="brand-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: "16px"
                    }}
                >
                    {BrandList.map((item, i) => (
                        <Link
                            key={i}
                            to={`/by-brand/${item._id}`}
                            className="card rounded-3 bg-white border-0 text-decoration-none d-flex flex-column align-items-center justify-content-center"
                            style={{ aspectRatio: "1 / 1" }} // makes it a square
                        >
                            <div className="p-2 text-center">
                                <img
                                    alt="img"
                                    src={item.brandImg}
                                    className="img-fluid"
                                    style={{
                                        maxHeight: "60px",
                                        objectFit: "contain"
                                    }}
                                />
                                <p className="bodySmal mt-2 mb-0 text-dark">{item.brandName}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;
