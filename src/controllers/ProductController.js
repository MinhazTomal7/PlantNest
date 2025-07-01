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