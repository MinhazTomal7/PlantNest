// routes/AdminDashboardSummary.js or inside your controller

const InvoiceModel = require('../models/InvoiceModel');
const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const BrandModel = require('../models/CategoryModel'); // double export file
// or fix: const BrandModel = require('../models/BrandModel');

exports.AdminDashboardSummary = async (req, res) => {
    try {
        const [
            totalOrders,
            totalRevenueObj,
            pendingDeliveries,
            successPayments,
            totalCustomers,
            totalProducts,
            totalCategories,
            totalBrands,
            recentOrders
        ] = await Promise.all([
            InvoiceModel.countDocuments(),
            InvoiceModel.aggregate([
                { $group: { _id: null, total: { $sum: "$payable" } } }

            ]),
            InvoiceModel.countDocuments({ delivery_status: "pending" }),
            InvoiceModel.countDocuments({ payment_status: "success" }),
            UserModel.countDocuments(),
            ProductModel.countDocuments(),
            CategoryModel.countDocuments(),
            BrandModel.countDocuments(),
            InvoiceModel.find().sort({ createdAt: -1 }).limit(5)
        ]);

        const totalRevenue = totalRevenueObj[0]?.total || 0;

        res.status(200).json({
            status: "success",
            data: {
                totalOrders,
                totalRevenue,
                pendingDeliveries,
                successPayments,
                totalCustomers,
                totalProducts,
                totalCategories,
                totalBrands,
                recentOrders
            }
        });

    } catch (err) {
        res.status(500).json({ status: "fail", message: err.message });
    }
};
