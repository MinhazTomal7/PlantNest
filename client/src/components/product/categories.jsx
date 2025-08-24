import React from 'react';
import ProductStore from "../../store/ProductStore.js";
import CategoriesSkeleton from "../../skeleton/categories-skeleton.jsx";
import { Link } from "react-router-dom";

const Categories = () => {
    const { CategoryList } = ProductStore();

    if (CategoryList === null) {
        return <CategoriesSkeleton />;
    }

    return (
        <div className="section">
            <div className="container">
                <h1 className="headline-4 text-center my-2 p-0">Top Categories</h1>
                <span className="bodySmal mb-5 text-center d-block">
          Explore a World of Choices Across Our Most Popular <br />Shopping Categories
        </span>

                {/* Custom grid for categories */}
                <div
                    className="category-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)", // 7 items per row on large screens
                        gap: "16px"
                    }}
                >
                    {CategoryList.map((item, i) => (
                        <Link
                            key={i}
                            to={`/by-category/${item._id}`}
                            className="card rounded-3 bg-white border-0 text-decoration-none d-flex flex-column align-items-center justify-content-center"
                            style={{ aspectRatio: "1 / 1" }} // makes card square
                        >
                            <div className="p-2 text-center">
                                <img
                                    alt=""
                                    src={item.categoryImg}
                                    className="img-fluid"
                                    style={{
                                        maxHeight: "60px",
                                        objectFit: "contain"
                                    }}
                                />
                                <p className="bodySmal mt-2 mb-0 text-dark">{item.categoryName}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
