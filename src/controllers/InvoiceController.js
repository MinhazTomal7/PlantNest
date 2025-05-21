const {CreateInvoiceService, PaymentFailService, PaymentSuccessService
, InvoiceListService, InvoiceProductListService, PaymentCancelService
, PaymentIPNService} = require("../services/InvoiceServices")

exports.CreateInvoice = async (req, res)=>{
    let result = await CreateInvoiceService(req);
    return res.status(200).json(result)
}


exports.PaymentSuccess = async (req, res) => {
    await PaymentSuccessService(req);
    return res.redirect('http://localhost:3000/profile');
};

exports.PaymentFail = async (req, res) => {
    await PaymentFailService(req);
    return res.redirect('http://localhost:3000/profile');
};

exports.PaymentCancel = async (req, res) => {
    await PaymentCancelService(req);
    return res.redirect('http://localhost:3000/profile');
};



exports.PaymentIPN = async (req, res)=>{
    let result = await PaymentIPNService(req);
    return res.status(200).json(result)
}


exports.InvoiceList = async (req, res)=>{
    let result = await InvoiceListService(req);
    return res.status(200).json(result)
}

exports.InvoiceProductList= async (req, res)=>{
    let result = await InvoiceProductListService(req);
    return res.status(200).json(result)
}