const mongoose = require("mongoose")
const CartModel = require("../models/CartModel")
const ProfileModel = require("../models/ProfileModel")
const InvoiceModel = require("../models/InvoiceModel")
const InvoiceProductModel = require("../models/InvoiceProductModel")
require('dotenv').config();
const ObjectID = mongoose.Types.ObjectId
const axios = require("axios")
const {from} = require("form-data");
const WishModel = require("../models/WishModel");

const CreateInvoiceService = async (req)=>{

    //Calculate total amount, payable & vat
    let user_id = new ObjectID(req.headers.user_id)
    let cus_email = req.headers.email

    let MatchStage = {$match:{userID:user_id}}

    let JoinProductStage = {
        $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "_id",
            as: "product",
        },
    };

    let UnwindStage = { $unwind: "$product" };

    let CartProducts = await CartModel.aggregate([
        MatchStage,
        JoinProductStage,
        UnwindStage
    ])

 let totalAmount = 0;
    CartProducts.forEach((element)=>{
        let price;
        if(element['product']['discount']){
            price = parseFloat(element['product']['discountPrice'])
        }
        else {
            price = parseFloat(element['product']['discount'])
        }

        totalAmount+= parseFloat(element['qty']*price)
    })

    let vat = totalAmount * 0.05
    let payable = totalAmount +vat

// Customer details and shipping details

    let Profile = await ProfileModel.aggregate([MatchStage])
    let cus_details = `Name:${Profile[0]['cus_name']}, Email:${cus_email}, Address:${Profile[0]['cus_add']}, Phone:${Profile[0]['cus_phone']} `
    let ship_details = `Name:${Profile[0]['ship_name']}, City:${Profile[0]['ship_city']}, Address:${Profile[0]['ship_add']}, Phone:${Profile[0]['ship_phone']} `

    let tran_id = Math.floor(10000000+Math.random()*90000000);
    let val_id = 0
    let delivery_status = "pending"
    let payment_status = "pending"


    //Create Invoice

    let createInvoice = await InvoiceModel.create({

        userID:user_id,
        payable:payable,
        cus_details:cus_details,
        ship_details:ship_details,
        tran_id:tran_id,
        val_id:val_id,
        delivery_status:delivery_status,
        payment_status:payment_status,
        total:totalAmount,
        vat:vat,

    })

    // Create invoice product

    let invoice_id = createInvoice['_id']
    CartProducts.forEach(async (element)=>{
            await InvoiceProductModel.create({
            userID:user_id,
            productID:element['productID'],
            invoiceID:invoice_id,
            qty:element['qty'],
            price:element['product']['discount']? element['product']['discountPrice']:element['product']['discount'],
            potColor:element['potColor'],
            plantSize:element['plantSize'],
        })
    })

    //Remove Cart

    await CartModel.deleteMany({userID:user_id})

    //SSL Commerz


    let PaymentSettings = {
        store_id: process.env.STORE_ID,
        store_passwd: process.env.STORE_PASSWD,
        currency: process.env.CURRENCY,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL,
        cancel_url: process.env.CANCEL_URL,
        ipn_url: process.env.IPN_URL,
        init_url: process.env.INIT_URL
    };

// Create a new FormData object
    const form = new FormData();
    form.append('store_id', PaymentSettings.store_id);
    form.append('store_passwd', PaymentSettings.store_passwd);
    form.append('total_amount', payable.toString());
    form.append('currency', PaymentSettings.currency);
    form.append('tran_id', tran_id);

    form.append('success_url', `${PaymentSettings.success_url}/${tran_id}`);
    form.append('fail_url', `${PaymentSettings.fail_url}/${tran_id}`);
    form.append('cancel_url', `${PaymentSettings.cancel_url}/${tran_id}`);
    form.append('ipn_url', `${PaymentSettings.ipn_url}/${tran_id}`);

    form.append('cus_name', Profile[0]['cus_name']);
    form.append('cus_email', cus_email);
    form.append('cus_add1', Profile[0]['cus_add']);
    form.append('cus_add2', Profile[0]['cus_add']);
    form.append('cus_city', Profile[0]['cus_city']);
    form.append('cus_state', Profile[0]['cus_state']);
    form.append('cus_postcode', Profile[0]['cus_postcode']);
    form.append('cus_country', Profile[0]['cus_country']);
    form.append('cus_phone', Profile[0]['cus_phone']);
    form.append('cus_fax', Profile[0]['cus_phone']);

    form.append('shipping_method', "YES");
    form.append('ship_name', Profile[0]['ship_name']);
    form.append('ship_add1', Profile[0]['ship_add']);
    form.append('ship_add2', Profile[0]['ship_add']);
    form.append('ship_city', Profile[0]['ship_city']);
    form.append('ship_state', Profile[0]['ship_state']);
    form.append('ship_country', Profile[0]['ship_country']);
    form.append('ship_postcode', Profile[0]['ship_postcode']);

    form.append('product_name', 'According Invoice');
    form.append('product_category', 'General');
    form.append('product_profile', 'E-commerce');


    const SSLRes = await axios.post(PaymentSettings.init_url, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });


    return { status: "success", data: SSLRes.data };



}


const PaymentSuccessService = async (req)=>{
 let trxID = req.params.trxID
    await InvoiceModel.updateOne({tran_id:trxID},{payment_status:"success"})
    return { status: "success" };
}

const PaymentFailService = async (req)=>{
    let trxID = req.params.trxID
    await InvoiceModel.updateOne({tran_id:trxID},{payment_status:"failed"})
    return { status: "fail"}

}

const PaymentCancelService = async (req)=>{
    let trxID = req.params.trxID
    await InvoiceModel.updateOne({tran_id:trxID},{payment_status:"cancel"})
    return { status: "cancel"}

}

const PaymentIPNService = async (req)=>{
    let trxID = req.params.trxID;
    let status = req.body['status'];
    await InvoiceModel.updateOne({tran_id:trxID},{payment_status:status})


}




const InvoiceListService = async (req)=>{
        let user_id = req.headers.user_id
        let invoice = await InvoiceModel.find({userID:user_id})
    return { status: "success", data: invoice };

}

const InvoiceProductListService = async (req) => {
    let user_id = new ObjectID(req.headers.user_id);
    let invoice_id = new ObjectID(req.params.invoice_id);

    let MatchStage = { $match: { userID: user_id, invoiceID: invoice_id } };

    let JoinProductStage = {
        $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "_id",
            as: "product",
        },
    };

    let UnwindStage = { $unwind: "$product" };

    let Products = await InvoiceProductModel.aggregate([
        MatchStage,
        JoinProductStage,
        UnwindStage,
    ]);
    return { status: "success", data: Products };
};


module.exports = {
    CreateInvoiceService,
    PaymentFailService,
    PaymentCancelService,
    PaymentIPNService,
    PaymentSuccessService,
    InvoiceProductListService,
    InvoiceListService
}