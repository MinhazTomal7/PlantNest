import React, { useEffect, useState } from 'react';
import ProductStore from "../../store/ProductStore.js";
import ProductsSkeleton from "../../skeleton/products-skeleton.jsx";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings/build/star-ratings.js";

const ProductList = () => {
    const {
        ListProduct,
        BrandList,
        CategoryList,
        BrandListRequest,
        CategoryListRequest,
        ListByFilterRequest
    } = ProductStore();

    const [Filter, SetFilter] = useState({
        brandID: "",
        categoryID: "",
        priceMax: "",
        priceMin: ""
    });

    // ✅ Load Brands & Categories once
    useEffect(() => {
        if (!BrandList.length) BrandListRequest();
        if (!CategoryList.length) CategoryListRequest();
    }, []);

    // ✅ Apply filters whenever Filter changes
    useEffect(() => {
        const hasFilters = Object.values(Filter).some(val => val !== "");
        if (hasFilters) ListByFilterRequest(Filter);
    }, [Filter]);

    const inputOnChange = (name, value) => {
        SetFilter(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mt-2">
            <div className="row">
                {/* Sidebar Filter */}
                <div className="col-md-3 p-2">
                    <div className="card vh-100 p-3 shadow-sm">
                        <label className="form-label mt-3">Brands</label>
                        <select
                            value={Filter.brandID}
                            onChange={(e) => inputOnChange('brandID', e.target.value)}
                            className="form-control form-select"
                        >
                            <option value="">Choose Brand</option>
                            {BrandList.map((item, i) => (
                                <option key={i} value={item._id}>{item.brandName}</option>
                            ))}
                        </select>

                        <label className="form-label mt-3">Categories</label>
                        <select
                            value={Filter.categoryID}
                            onChange={(e) => inputOnChange('categoryID', e.target.value)}
                            className="form-control form-select"
                        >
                            <option value="">Choose Category</option>
                            {CategoryList.map((item, i) => (
                                <option key={i} value={item._id}>{item.categoryName}</option>
                            ))}
                        </select>

                        <label className="form-label mt-3">Maximum Price ৳{Filter.priceMax}</label>
                        <input
                            value={Filter.priceMax}
                            onChange={(e) => inputOnChange('priceMax', e.target.value)}
                            min={0}
                            max={10000}
                            step={50}
                            type="range"
                            className="form-range"
                        />

                        <label className="form-label mt-3">Minimum Price ৳{Filter.priceMin}</label>
                        <input
                            value={Filter.priceMin}
                            onChange={(e) => inputOnChange('priceMin', e.target.value)}
                            min={0}
                            max={10000}
                            step={50}
                            type="range"
                            className="form-range"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="col-md-9 p-2">
                    <div className="container">
                        <div className="row">
                            {ListProduct === null ? (
                                <ProductsSkeleton />
                            ) : (
                                ListProduct.map((item, i) => {
                                    const price = item.discount
                                        ? <p className="bodyMedium text-dark my-1">
                                            Price: <strike>৳{item.price}</strike> ৳{item.discountPrice}
                                        </p>
                                        : <p className="bodyMedium text-dark my-1">
                                            Price: ৳{item.price}
                                        </p>;

                                    return (
                                        <div key={i} className="col-md-3 p-2 col-lg-3 col-sm-6 col-12">
                                            <Link to={`/details/${item._id}`} className="card shadow-sm h-100 rounded-3 bg-white">
                                                <img className="w-100 rounded-top-2" src={item.img} alt="product" />
                                                <div className="card-body">
                                                    <p className="bodySmal text-secondary my-1">{item.title}</p>
                                                    {price}
                                                    <StarRatings
                                                        rating={parseFloat(item.star)}
                                                        starRatedColor="red"
                                                        starDimension="15px"
                                                        starSpacing="2px"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
