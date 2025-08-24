const express = require('express');
const ProductController = require('../controllers/ProductController');
const UserController = require('../controllers/UserController')
const WishListController = require('../controllers/WishListController')
const CartListController = require('../controllers/CartListController')
const InvoiceController = require('../controllers/InvoiceController')
const FeaturesController = require('../controllers/FeaturesController')
const AuthVerification = require('../middlewares/AuthVerification')
const AdminController = require('../controllers/AdminController');
const upload = require('../middlewares/upload.js');


const router = express.Router();
//Products

router.get('/ProductBrandList',ProductController.ProductBrandList);
router.get('/ProductCategoryList',ProductController.ProductCategoryList)
router.get('/ProductSliderList',ProductController.ProductSliderList)
router.get('/ProductListByBrand/:BrandID',ProductController.ProductListByBrand);
router.get('/ProductListByCategory/:CategoryID',ProductController.ProductListByCategory)
router.get('/ProductListBySmiler/:CategoryID',ProductController.ProductListBySmiler)
router.get('/ProductListByKeyword/:Keyword',ProductController.ProductListByKeyword);
router.get('/ProductListByRemark/:Remark',ProductController.ProductListByRemark);
router.get('/ProductDetails/:ProductID',ProductController.ProductDetails);
router.get('/ProductReviewList/:ProductID',ProductController.ProductReviewList);
router.post('/ProductListByFilter',ProductController.ProductListByFilter);

//User

router.get('/UserOTP/:email',UserController.UserOTP);
router.get('/VerifyOTP/:email/:otp',UserController.VerifyOTP);
router.get('/UserLogout', AuthVerification, UserController.UserLogout);
router.post('/CreateProfile', AuthVerification, UserController.CreateProfile);
router.post('/UpdateProfile', AuthVerification, UserController.UpdateProfile);
router.get('/ReadProfile', AuthVerification, UserController.ReadProfile);

//Wish List

router.post('/SaveWishList', AuthVerification, WishListController.SaveWishList);
router.post('/RemoveWishList', AuthVerification, WishListController.RemoveWishList);
router.get('/WishList', AuthVerification, WishListController.WishList);

//Cart List

router.post('/SaveCartList', AuthVerification, CartListController.SaveCartList);
router.post('/UpdateCartList/:cartID', AuthVerification, CartListController.UpdateCartList);
router.post('/RemoveCartList', AuthVerification, CartListController.RemoveCartList);
router.get('/CartList', AuthVerification, CartListController.CartList);

//Invoice Payment

router.get('/CreateInvoice', AuthVerification, InvoiceController.CreateInvoice);
router.get('/InvoiceList',AuthVerification, InvoiceController.InvoiceList);
router.get('/InvoiceProductList/:invoice_id',AuthVerification,InvoiceController.InvoiceProductList)

router.post('/PaymentSuccess/:trxID', InvoiceController.PaymentSuccess);
router.post('/PaymentCancel/:trxID', InvoiceController.PaymentCancel);
router.post('/PaymentFail/:trxID', InvoiceController.PaymentFail);
router.post('/PaymentIPN/:trxID', InvoiceController.PaymentIPN);


//Features
router.get('/FeaturesList', FeaturesController.FeaturesList);
router.get("/LegalDetails/:type", FeaturesController.LegalDetails)

//Review
router.post('/CreateReview',AuthVerification,  ProductController.CreateReview);


//Admin
router.get('/ProductList', ProductController.ProductList);
router.post(
    "/ProductCreate",
    upload.fields([
        { name: "img", maxCount: 1 },   // main image
        { name: "img1", maxCount: 1 },
        { name: "img2", maxCount: 1 },
        { name: "img3", maxCount: 1 },
        { name: "img4", maxCount: 1 },
        { name: "img5", maxCount: 1 },
        { name: "img6", maxCount: 1 },
        { name: "img7", maxCount: 1 },
        { name: "img8", maxCount: 1 },
    ]),
    ProductController.ProductCreate
);

router.delete('/ProductDelete/:id', ProductController.ProductDelete);
router.get('/AdminInvoiceList', InvoiceController.AdminInvoiceList);
router.get('/AdminDashboardSummary', AdminController.AdminDashboardSummary);


module.exports = router;