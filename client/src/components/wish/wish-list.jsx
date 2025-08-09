import React, { useEffect } from "react";
import ProductsSkeleton from "../../skeleton/products-skeleton.jsx";
import WishStore from "../../store/WishStore.js";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings/build/star-ratings.js";
import NoData from "../layout/no-data.jsx";

// Price maps
const sizePriceMap = {
    Small: 0,
    Medium: 50,
    Large: 100,
};

const potColorPriceMap = {
    Default: 0,
    White: 30,
    Metallic: 60,
    Terracotta: 20, // Add more if needed
};

const calculateDepreciatedPrice = (originalPrice, createdAt, ratePerMonth = 0.02) => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffTime = now - createdDate; // milliseconds
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    const dailyRate = 1 - Math.pow(1 - ratePerMonth, 1 / 30);

    const depreciatedPrice = originalPrice * Math.pow(1 - dailyRate, diffDays);

    return Math.max(Math.round(depreciatedPrice), 1);
};

const WishList = () => {
    const { WishListRequest, WishList, RemoveWishListRequest } = WishStore();

    useEffect(() => {
        (async () => {
            await WishListRequest();
        })();
    }, []);

    const remove = async (productID) => {
        await RemoveWishListRequest(productID);
        await WishListRequest();
    };

    if (WishList === null) {
        return (
            <div className="container">
                <div className="row">
                    <ProductsSkeleton />
                </div>
            </div>
        );
    } else if (WishList.length === 0) {
        return <NoData />;
    } else {
        return (
            <div className="container mt-3">
                <div className="row">
                    {WishList.map((item, i) => {
                        const product = item.product;
                        const basePrice = product.discount ? Number(product.discountPrice) : Number(product.price);

                        // Calculate depreciated price
                        const depreciatedPrice = calculateDepreciatedPrice(basePrice, product.createdAt);

                        // Extras based on potColor and plantSize if available
                        const extraSize = sizePriceMap[item.plantSize] || 0;
                        const extraColor = potColorPriceMap[item.potColor] || 0;

                        const finalPrice = depreciatedPrice + extraSize + extraColor;

                        return (
                            <div key={i} className="col-md-3 p-2 col-lg-3 col-sm-6 col-12">
                                <div className="card shadow-sm h-100 rounded-3 bg-white">
                                    <div className="card-body">
                                        <p className="bodySmal text-secondary my-1">{product.title}</p>
                                        <p className="bodyMedium text-dark my-1">
                                            Price: ৳{finalPrice}
                                        </p>
                                        <StarRatings
                                            rating={parseFloat(product.star)}
                                            starRatedColor="red"
                                            starDimension="15px"
                                            starSpacing="2px"
                                        />
                                        <p className="mt-3">
                                            <button
                                                onClick={async () => {
                                                    await remove(item.productID);
                                                }}
                                                className="btn btn-outline-danger btn-sm"
                                            >
                                                Remove
                                            </button>
                                            <Link className="btn mx-2 btn-outline-success btn-sm" to={`/details/${item.productID}`}>
                                                Details
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
};

export default WishList;
