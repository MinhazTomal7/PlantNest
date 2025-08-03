import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <nav style={{ width: '260px', background: '#21bf73', color: '#fff', padding: '20px' }}>
                <h2>Admin Panel</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li><Link style={{ color: '#fff' }} to="/admin">Dashboard</Link></li>
                    <li><Link style={{ color: '#fff' }} to="/admin/products">Products</Link></li>
                    <li><Link style={{ color: '#fff' }} to="/admin/orders">Orders</Link></li>
                    {/* add more admin links here */}
                </ul>
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '20px' }}>
                {/* You can add a header here if you want */}
                <Outlet /> {/* Render nested admin routes here */}
            </main>
        </div>
    );
};

export default AdminLayout;
