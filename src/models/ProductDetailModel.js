const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
        img1:{type:String, required: true},
        img2:{type:String, required: true},
        img3:{type:String, required: true},
        img4:{type:String, required: true},
        img5:{type:String},
        img6:{type:String},
        img7:{type:String},
        img8:{type:String},
        desAndCare:{type:String, required: true},
            potColor:{type:String, required: true},
            plantSize:{type:String, required: true},
        productID:{type:mongoose.Schema.Types.ObjectId, required: true},
    },
    {timestamps:true, versionKey:false},
)

const ProductDetailModel = mongoose.model('productdetails', DataSchema);
module.exports = ProductDetailModel;