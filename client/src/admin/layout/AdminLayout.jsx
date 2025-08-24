import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        navigate("/admin");
        window.location.reload()
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <nav style={{ width: 260, background: "#21bf73", color: "#fff", padding: 20 }}>
                <h2>Admin Panel</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li><Link style={{ color: "#fff" }} to="/admin">Dashboard</Link></li>
                    <li><Link style={{ color: "#fff" }} to="/admin/products">Products</Link></li>
                    <li><Link style={{ color: "#fff" }} to="/admin/orders">Orders</Link></li>
                </ul>
                <button
                    onClick={logout}
                    style={{ marginTop: 20, padding: 10, background: "red", color: "white", border: "none", borderRadius: 4 }}
                >
                    Logout
                </button>
            </nav>

            <main style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
