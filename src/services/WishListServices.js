const WishModel = require("../models/WishModel")

const mongoose = require("mongoose")
const ObjectID = mongoose.Types.ObjectId
const WishListService = async (req) =>{

  try{
      let user_id = new ObjectID(req.headers.user_id)
      let MatchStage = {$match:{userID:user_id}}

      let JoinProductStage = {
          $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "product",
          },
      };
      let UnwindProductStage = { $unwind: "$product" };

      let JoinBrandStage = {
          $lookup: {
              from: "brands",
              localField: "product.brandID",
              foreignField: "_id",
              as: "brand",
          },
      };
      let UnwindBrandStage = { $unwind: "$brand" };


      let JoinCategoryStage = {
          $lookup: {
              from: "categories",
              localField: "product.categoryID",
              foreignField: "_id",
              as: "category",
          },
      };
      let UnwindCategoryStage = { $unwind: "$category" };

      let projectionStage = {
          $project:{
              '_id': 0 , 'userID':0,
              'createdAt':0, 'updatedAt': 0,
              'product._id':0, 'product.categoryID':0, 'product.brandID':0,
              'brand._id':0, 'category._id':0

          }
      }



      let data = await WishModel.aggregate([
          MatchStage,
          JoinProductStage,
          UnwindProductStage,
          JoinBrandStage,
          UnwindBrandStage,
          JoinCategoryStage,
          UnwindCategoryStage,
          projectionStage
      ])
      return{status:"success", data:data}


  }
    catch (e){
        return{status:"fail", message:"Something Went Wrong"}
    }
}

const SaveWishListService = async (req) =>{
 let user_id = req.headers.user_id;
 let reqBody = req.body;
 reqBody.userID = user_id
 await WishModel.updateOne(
     reqBody,
     {$set:reqBody},
    {upsert:true})
    return{status:"success", message:"Wish list save success"}
}


const RemoveWishListService = async (req) =>{
    let user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id
    await WishModel.deleteOne(
        reqBody,
        {$set:reqBody},
        {upsert:true})
    return{status:"success", message:"Wish list removed"}
}

module.exports ={
    WishListService,
    SaveWishListService,
    RemoveWishListService
}