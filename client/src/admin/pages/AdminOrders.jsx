import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCustomerName = (cus_details) => {
        const match = cus_details.match(/Name:([^,]+)/);
        return match ? match[1].trim() : "N/A";
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/AdminInvoiceList", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (res.data.status === "success") {
                    setOrders(res.data.data);
                } else {
                    toast.error("Failed to fetch orders");
                }
            } catch (error) {
                toast.error("Error fetching orders");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="admin-orders-container">
            <h2 className="admin-orders-title">Admin Orders</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="admin-orders-table">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Payable</th>
                        <th>Payment Status</th>
                        <th>Delivery Status</th>
                        <th>Order Time</th>
                        <th>Transaction ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{getCustomerName(order.cus_details)}</td>
                            <td>৳{order.payable}</td>
                            <td
                                className={
                                    order.payment_status === "success"
                                        ? "admin-status-success"
                                        : order.payment_status === "fail"
                                            ? "admin-status-fail"
                                            : "admin-status-pending"
                                }
                            >
                                {order.payment_status}
                            </td>

                            <td
                                className={
                                    order.delivery_status === "pending"
                                        ? "admin-status-pending"
                                        : "admin-status-success"
                                }
                            >
                                {order.delivery_status}
                            </td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{order.tran_id}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOrders;
