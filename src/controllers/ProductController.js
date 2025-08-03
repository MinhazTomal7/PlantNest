const {
    BrandListService,
    CategoryListService,
    SliderListService,
    ListByBrandService,
    ListByCategoryService,
    ListBySmilerService,
    ListByKeywordService,
    ListByRemarkService,
    DetailsService,
    ReviewListService,
    CreateReviewService,
    ListByFilterService
} = require('../services/ProductService');
const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const BrandModel = require('../models/BrandModel');
const CategoryModel = require('../models/CategoryModel');
const ProductDetailModel = require("../models/ProductDetailModel");
const ObjectID = mongoose.Types.ObjectId




exports.ProductBrandList = async(req, res)=>{

    let result = await BrandListService()
    return res.status(200).json(result)
}

exports.ProductCategoryList = async(req, res)=>{

    let result = await CategoryListService()
    return res.status(200).json(result)
}

exports.ProductSliderList = async(req, res)=>{

    let result = await SliderListService()
    return res.status(200).json(result)
}


exports.ProductListByBrand = async (req, res) => {
    try {
        const BrandID = req.params.BrandID;
        let result = await ListByBrandService(BrandID);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
};


exports.ProductListByCategory= async(req, res)=>{
    try {
        const CategoryID = req.params.CategoryID;
        let result = await ListByCategoryService(CategoryID);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}

exports.ProductListBySmiler= async(req, res)=> {
    try {
        const CategoryID = req.params.CategoryID;
        let result = await ListBySmilerService(CategoryID);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}

exports.ProductListByKeyword= async(req, res)=>{
    try {
        const Keyword = req.params.Keyword;
        let result = await ListByKeywordService(Keyword);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}

exports.ProductListByRemark= async(req, res)=>{
    try {
        const Remark = req.params.Remark;
        let result = await ListByRemarkService(Remark);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}

exports.ProductListByFilter = async (req, res) => {
    try {
        let result = await ListByFilterService(req);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
};



exports.ProductDetails= async(req, res)=>{
    try {
        const ProductID = req.params.ProductID;
        let result = await DetailsService(ProductID);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}

exports.ProductReviewList= async(req, res)=>{

    try {
        const ProductID = req.params.ProductID;
        let result = await ReviewListService(ProductID);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}


exports.CreateReview= async(req, res)=>{

    try {

        let result = await CreateReviewService(req);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "Failed", data: err.toString() });
    }
}

//Admin

exports.ProductList = async (req, res) => {
    try {
        const products = await ProductModel.find().lean();

        const populated = await Promise.all(products.map(async (item) => {
            let brandName = "N/A";
            let categoryName = "N/A";

            try {
                if (item.brandID) {
                    const brand = await BrandModel.findOne({ _id: item.brandID }).lean();


                    if (brand?.brandName) brandName = brand.brandName;
                }

                if (item.categoryID) {
                    const category = await CategoryModel.findOne({ _id: item.categoryID }).lean();
                    if (category?.categoryName) categoryName = category.categoryName;
                }

            } catch (e) {
                // fail silently if brand or category not found
            }

            return {
                ...item,
                brand: brandName,
                category: categoryName,
            };
        }));

        res.status(200).json({ status: "success", data: populated });

    } catch (e) {
        res.status(400).json({ status: "fail", message: "Unable to fetch products" });
    }
};


exports.ProductCreate = async (req, res) => {
    try {
        const {
            title, shortDes, price, discount, discountPrice, stock, star, remark, img,
            categoryID, brandID,
            img1, img2, img3, img4, img5, img6, img7, img8,
            potColor, plantSize, desAndCare
        } = req.body;

        // Validate categoryID and brandID as valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(categoryID)) {
            return res.status(400).json({ status: "fail", message: "Invalid categoryID" });
        }
        if (!mongoose.Types.ObjectId.isValid(brandID)) {
            return res.status(400).json({ status: "fail", message: "Invalid brandID" });
        }

        // 1. Create base product
        const newProduct = await ProductModel.create({
            title, shortDes, price, discount, discountPrice, stock, star, remark, img,
            categoryID, brandID
        });

        // 2. Prepare product details fields safely:
        const productID = newProduct._id;

        // Convert potColor and plantSize to comma separated strings if they are arrays
        const potColorStr = Array.isArray(potColor) ? potColor.join(",") : (potColor || "");
        const plantSizeStr = Array.isArray(plantSize) ? plantSize.join(",") : (plantSize || "");

        await ProductDetailModel.create({
            productID,
            img1: img1 || "",
            img2: img2 || "",
            img3: img3 || "",
            img4: img4 || "",
            img5: img5 || "",
            img6: img6 || "",
            img7: img7 || "",
            img8: img8 || "",
            potColor: potColorStr,
            plantSize: plantSizeStr,
            desAndCare: desAndCare || ""
        });

        res.status(201).json({ status: "success", message: "Product and details created", data: newProduct });
    } catch (error) {
        console.error("ProductCreate error:", error);
        res.status(500).json({ status: "fail", message: "Product creation failed", error });
    }
};


exports.ProductDelete = async (req, res) => {
    try {
        const productId = req.params.id;

        // Check if ID is valid ObjectId
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid product ID' });
        }

        const deleted = await ProductModel.findByIdAndDelete(productId);

        if (!deleted) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        return res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};