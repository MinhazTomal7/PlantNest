const FeaturesModel = require("../models/FeaturesModel");
const FeaturesListService = async ()=>{
    try{
        let data = await FeaturesModel.find()
        return{status:"Success", data:data}

    }
    catch (err){
        return{status:"Failed", data:err}.toString()
    }

}

module.exports = {FeaturesListService}