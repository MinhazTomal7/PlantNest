import React from 'react';
import ProductStore from "../../store/ProductStore.js";
import StarRatings from "react-star-ratings/build/star-ratings.js";

const Reviews = () => {
    const { ReviewList } = ProductStore();

    if (!ReviewList || !Array.isArray(ReviewList) || ReviewList.length === 0) {
        return <p>No reviews available.</p>;
    }

    return (
        <div>
            <ul className="list-group mt-4 list-group-flush">
                {ReviewList.map((item, i) => {
                    const customerName = item?.profile?.cus_name ?? "Anonymous";
                    const rating = parseFloat(item?.rating) || 0;
                    const description = item?.des || "No description provided.";

                    return (
                        <li key={i} className="list-group-item bg-transparent">
                            <h6 className="m-0 p-0">
                                <i className="bi bi-person"></i> {customerName}
                            </h6>
                            <StarRatings
                                rating={rating}
                                starRatedColor="red"
                                starDimension="15px"
                                starSpacing="2px"
                            />
                            <p>{description}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Reviews;
