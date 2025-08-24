const CartModel = require("../models/CartModel");
const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;

const CartListService = async (req) => {
    try {
        let user_id = new ObjectID(req.headers.user_id);

        let data = await CartModel.aggregate([
            { $match: { userID: user_id } },

            // Join Product
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },

            // Join Brand
            {
                $lookup: {
                    from: "brands",
                    localField: "product.brandID",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            { $unwind: "$brand" },

            // Join Category
            {
                $lookup: {
                    from: "categories",
                    localField: "product.categoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },

            // Projection (keep _id)
            {
                $project: {
                    _id: 1, // keep cart item id
                    userID: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    "product._id": 0,
                    "product.categoryID": 0,
                    "product.brandID": 0,
                    "brand._id": 0,
                    "category._id": 0,
                },
            },
        ]);

        return { status: "success", data: data };
    } catch (e) {
        return { status: "fail", message: "Something Went Wrong" };
    }
};

const SaveCartListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let reqBody = req.body;
        reqBody.userID = user_id;

        await CartModel.create(reqBody);
        return { status: "success", message: "CartList Create Success" };
    } catch (e) {
        return { status: "fail", message: "Something Went Wrong" };
    }
};

const UpdateCartListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let cartID = req.params.cartID;
        let reqBody = req.body;

        await CartModel.updateOne({ _id: cartID, userID: user_id }, { $set: reqBody });
        return { status: "success", message: "CartList Updated" };
    } catch (e) {
        return { status: "fail", message: "CartList Update Failed" };
    }
};

const RemoveCartListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let cartID = req.body._id;

        await CartModel.deleteOne({ _id: cartID, userID: user_id });
        return { status: "success", message: "CartList Removed" };
    } catch (e) {
        return { status: "fail", message: "CartList Remove Failed" };
    }
};

module.exports = {
    CartListService,
    SaveCartListService,
    UpdateCartListService,
    RemoveCartListService,
};
