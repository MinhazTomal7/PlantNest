import React, { useEffect } from 'react';
import DashboardStore from '../../store/DashboardStore.js';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from "../../admin/components/ui/card.jsx";


const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const { summary, loading, fetchDashboardSummary } = DashboardStore();

    useEffect(() => {
        fetchDashboardSummary();
    }, []);

    const totalOrders = summary?.totalOrders || 0;
    const successPayments = summary?.successPayments || 0;
    const pendingDeliveries = summary?.pendingDeliveries || 0;
    const failedPayments = totalOrders - successPayments;

    const paymentData = [
        { name: 'Successful', value: successPayments },
        { name: 'Failed', value: failedPayments },
        { name: 'Pending', value: pendingDeliveries },
    ];

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">📊 Dashboard Summary</h2>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent><p>Total Orders</p><h3 className="text-xl">{totalOrders}</h3></CardContent></Card>
                <Card><CardContent><p>Pending Deliveries</p><h3 className="text-xl">{pendingDeliveries}</h3></CardContent></Card>
                <Card><CardContent><p>Success Payments</p><h3 className="text-xl">{successPayments}</h3></CardContent></Card>
                <Card><CardContent><p>Total Customers</p><h3 className="text-xl">{summary?.totalCustomers || 0}</h3></CardContent></Card>
                <Card><CardContent><p>Total Products</p><h3 className="text-xl">{summary?.totalProducts || 0}</h3></CardContent></Card>
                <Card><CardContent><p>Total Categories</p><h3 className="text-xl">{summary?.totalCategories || 0}</h3></CardContent></Card>
                <Card><CardContent><p>Total Brands</p><h3 className="text-xl">{summary?.totalBrands || 0}</h3></CardContent></Card>
            </div>

            {/* Charts */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">💳 Payment Status Chart</h3>
                <PieChart width={400} height={300}>
                    <Pie data={paymentData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                        {paymentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            {/* Recent Orders Table */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">🧾 Recent Orders</h3>
                {summary?.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Transaction ID</th>
                                <th className="p-2 border">Payment</th>
                                <th className="p-2 border">Payable</th>
                                <th className="p-2 border">Delivery</th>
                                <th className="p-2 border">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{order.tran_id}</td>
                                    <td className="p-2 border">{order.payment_status}</td>
                                    <td className="p-2 border">৳{order.payable}</td>
                                    <td className="p-2 border">{order.delivery_status}</td>
                                    <td className="p-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No recent orders found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

