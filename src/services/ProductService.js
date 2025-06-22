const mongoose = require("mongoose");
const BrandModel = require('../models/BrandModel');
const CategoryModel = require('../models/CategoryModel');
const ProductSliderModel = require('../models/ProductSliderModel');
const ProductModel = require('../models/ProductModel');
const ProductDetailModel = require('../models/ProductDetailModel');
const ReviewModel = require('../models/ReviewModel');
const ObjectID = mongoose.Types.ObjectId;




const BrandListService = async ()=>{
    try{
       let data = await BrandModel.find()
        return{status:"Success", data:data}

    }
    catch (err){
        return{status:"Failed", data:err}.toString()
    }

}

const CategoryListService = async ()=>{
    try{
        let data = await CategoryModel.find()
        return{status:"Success", data:data}

    }
    catch (err){
        return{status:"Failed", data:err}.toString()
    }

}

const SliderListService = async ()=>{
    try{
        let data = await ProductSliderModel.find()
        return{status:"Success", data:data}

    }
    catch (err){
        return{status:"Failed", data:err}.toString()
    }

}

const ListByBrandService = async (BrandID) => {
    try {
        let MatchStage = { $match: { brandID: new ObjectID(BrandID) } };

        let JoinWithBrandStage = {
            $lookup: {
                from: "brands", // Collection name for brands
                localField: "brandID",
                foreignField: "_id",
                as: "brands",
            },
        };

        let JoinWithCategoryStage = {
            $lookup: {
                from: "categories", // Collection name for categories
                localField: "categoryID",
                foreignField: "_id",
                as: "categories",
            },
        };

        let UnwindBrandStage = { $unwind: "$brands" };
        let UnwindCategoryStage = { $unwind: "$categories" };

        let ProjectionStage = {
            $project: {
                'brands._id': 0,
                'categories._id': 0,
                brandID: 0,
                categoryID: 0,
            },
        };

        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            ProjectionStage,
        ]);

        return { status: "Success", data: data };
    } catch (err) {
        return { status: "Failed", data: err.message };
    }
};


const ListByCategoryService = async (CategoryID)=>{
    try {
        let MatchStage = { $match: { categoryID: new ObjectID(CategoryID) } };

        let JoinWithBrandStage = {
            $lookup: {
                from: "brands", // Collection name for brands
                localField: "brandID",
                foreignField: "_id",
                as: "brands",
            },
        };

        let JoinWithCategoryStage = {
            $lookup: {
                from: "categories", // Collection name for categories
                localField: "categoryID",
                foreignField: "_id",
                as: "categories",
            },
        };

        let UnwindBrandStage = { $unwind: "$brands" };
        let UnwindCategoryStage = { $unwind: "$categories" };

        let ProjectionStage = {
            $project: {
                'brands._id': 0,
                'categories._id': 0,
                brandID: 0,
                categoryID: 0,
            },
        };

        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            ProjectionStage,
        ]);

        return { status: "Success", data: data };
    } catch (err) {
        return { status: "Failed", data: err.message };
    }
}


const ListByRemarkService = async (Remark)=>{
    try {
        let MatchStage = { $match: { remark: Remark } };

        let JoinWithBrandStage = {
            $lookup: {
                from: "brands", // Collection name for brands
                localField: "brandID",
                foreignField: "_id",
                as: "brands",
            },
        };

        let JoinWithCategoryStage = {
            $lookup: {
                from: "categories", // Collection name for categories
                localField: "categoryID",
                foreignField: "_id",
                as: "categories",
            },
        };

        let UnwindBrandStage = { $unwind: "$brands" };
        let UnwindCategoryStage = { $unwind: "$categories" };

        let ProjectionStage = {
            $project: {
                'brands._id': 0,
                'categories._id': 0,
                brandID: 0,
                categoryID: 0,
            },
        };

        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            ProjectionStage,
        ]);

        return { status: "Success", data: data };
    } catch (err) {
        return { status: "Failed", data: err.message };
    }
}


const ListBySmilerService = async (CategoryID)=>{
    try {
        let MatchStage = { $match: { categoryID: new ObjectID(CategoryID) } };
        let limitStage = {$limit: 20};

        let JoinWithBrandStage = {
            $lookup: {
                from: "brands", // Collection name for brands
                localField: "brandID",
                foreignField: "_id",
                as: "brands",
            },
        };

        let JoinWithCategoryStage = {
            $lookup: {
                from: "categories", // Collection name for categories
                localField: "categoryID",
                foreignField: "_id",
                as: "categories",
            },
        };

        let UnwindBrandStage = { $unwind: "$brands" };
        let UnwindCategoryStage = { $unwind: "$categories" };

        let ProjectionStage = {
            $project: {
                'brands._id': 0,
                'categories._id': 0,
                brandID: 0,
                categoryID: 0,
            },
        };

        let data = await ProductModel.aggregate([
            MatchStage,
            limitStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            ProjectionStage,
        ]);

        return { status: "Success", data: data };
    } catch (err) {
        return { status: "Failed", data: err.message };
    }
}


const DetailsService = async (ProductID)=>{
    let MatchStage = { $match: { _id: new ObjectID(ProductID) } };
    let JoinWithBrandStage = {
        $lookup: {
            from: "brands",
            localField: "brandID",
            foreignField: "_id",
            as: "brands",
        },
    };

    let JoinWithCategoryStage = {
        $lookup: {
            from: "categories",
            localField: "categoryID",
            foreignField: "_id",
            as: "categories",
        },
    };

    let JoinWithDetailsStage = {
        $lookup: {
            from: "productdetails",
            localField: "_id",
            foreignField: "productID",
            as: "details",
        },
    };

    let UnwindBrandStage = { $unwind: "$brands" };
    let UnwindCategoryStage = { $unwind: "$categories" };
    let UnwindDetailsStage = { $unwind: "$details" };

    let ProjectionStage = {
        $project: {
            'brands._id': 0,
            'categories._id': 0,
            brandID: 0,
            categoryID: 0,
        },
    };

    let data = await ProductModel.aggregate([
        MatchStage,
        JoinWithBrandStage,
        JoinWithCategoryStage,
        JoinWithDetailsStage,
        UnwindBrandStage,
        UnwindCategoryStage,
        UnwindDetailsStage,
        ProjectionStage,
    ]);
    return { status: "Success", data: data };
}



const ListByKeywordService = async (Keyword)=>{

    let SearchRegex = {"$regex": Keyword, "$options":"i"};
    let SearchParams = [{title: SearchRegex}, {shortDes:SearchRegex}]
    let SearchQuery = {$or:SearchParams}
    let MatchStage = {$match:SearchQuery}

    let JoinWithBrandStage = {
        $lookup: {
            from: "brands",
            localField: "brandID",
            foreignField: "_id",
            as: "brands",
        },
    };

    let JoinWithCategoryStage = {
        $lookup: {
            from: "categories",
            localField: "categoryID",
            foreignField: "_id",
            as: "categories",
        },
    };

    let UnwindBrandStage = { $unwind: "$brands" };
    let UnwindCategoryStage = { $unwind: "$categories" };

    let ProjectionStage = {
        $project: {
            'brands._id': 0,
            'categories._id': 0,
            brandID: 0,
            categoryID: 0,
        },
    };
    let data = await ProductModel.aggregate([
        MatchStage,
        JoinWithBrandStage,
        JoinWithCategoryStage,
        UnwindBrandStage,
        UnwindCategoryStage,
        ProjectionStage,
    ]);

    return { status: "Success", data: data };


}


const ReviewListService = async (ProductID) => {
    const MatchStage = { $match: { productID: new ObjectID(ProductID) } };

    const JoinWithProfileStage = {
        $lookup: {
            from: "profiles",
            localField: "userID",
            foreignField: "userID",
            as: "profiles",
        },
    };

    // Unwind profiles to flatten the result
    const UnwindProfilesStage = { $unwind: { path: "$profiles", preserveNullAndEmptyArrays: true } };

    // Optional: Filter to exclude reviews without matching profiles
    const FilterValidProfilesStage = { $match: { "profiles.userID": { $exists: true } } };

    const ProjectStage = {
        $project: {
            des: 1,
            rating: 1,
            "profiles.cus_name": 1,

        },
    };

    const data = await ReviewModel.aggregate([
        MatchStage,
        JoinWithProfileStage,
        UnwindProfilesStage,
        FilterValidProfilesStage,
        ProjectStage,
    ]);

    return { status: "Success", data: data };
};




const CreateReviewService = async (req)=>{
    let user_id = req.headers.user_id;
    let reqBody = req.body
    try{
      let data = await ReviewModel.create({
           productID:reqBody['productID'],
           userID:user_id,
           des:reqBody['des'],
           rating:reqBody['rating']
       })
        return { status: "Success", data: data };
    }
    catch (err){
        return{status:"Failed", data:err}.toString()
    }

}

const ListByFilterService = async (req) => {
    try {

        let matchConditions = {};
        if (req.body['categoryID']) {
            matchConditions.categoryID = new ObjectId(req.body['categoryID']);
        }
        if (req.body['brandID']) {
            matchConditions.brandID = new ObjectId(req.body['brandID']);
        }
        let MatchStage = { $match: matchConditions };






        let AddFieldsStage = {
            $addFields: { numericPrice: { $toInt: "$price" }}
        };
        let priceMin = parseInt(req.body['priceMin']);
        let priceMax = parseInt(req.body['priceMax']);
        let PriceMatchConditions = {};
        if (!isNaN(priceMin)) {
            PriceMatchConditions['numericPrice'] = { $gte: priceMin };
        }
        if (!isNaN(priceMax)) {
            PriceMatchConditions['numericPrice'] = { ...(PriceMatchConditions['numericPrice'] || {}), $lte: priceMax };
        }
        let PriceMatchStage = { $match: PriceMatchConditions };






        let JoinWithBrandStage= {$lookup:{from:"brands",localField:"brandID",foreignField:"_id",as:"brand"}};
        let JoinWithCategoryStage={$lookup:{from:"categories",localField:"categoryID",foreignField:"_id",as:"category"}};
        let UnwindBrandStage={$unwind:"$brand"}
        let UnwindCategoryStage={$unwind:"$category"}
        let ProjectionStage={$project:{'brand._id':0,'category._id':0,'categoryID':0,'brandID':0}}

        let data= await  ProductModel.aggregate([
            MatchStage,
            AddFieldsStage,
            PriceMatchStage,
            JoinWithBrandStage,JoinWithCategoryStage,
            UnwindBrandStage,UnwindCategoryStage, ProjectionStage
        ])
        return {status:"success",data:data}

    }catch (e) {
        return {status:"fail",data:e}.toString()
    }
}





module.exports = {
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
}















