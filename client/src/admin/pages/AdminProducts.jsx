import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; //

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); //

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let res = await axios.get('http://localhost:3000/api/ProductList');
            setProducts(res.data.data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`http://localhost:3000/api/ProductDelete/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Failed to delete the product.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="admin-products-container">
            <h1>All Products</h1>

            {/* Add Product Button */}
            <button
                className="add-product-button"
                onClick={() => navigate('/admin/add-product')}
            >
                Add Product
            </button>


            <table className="admin-products-table" border="0" cellPadding="0" cellSpacing="0">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Img</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((item) => (
                    <tr key={item._id}>
                        <td>{item.title}</td>
                        <td><img src={item.img} alt={item.title} style={{width: '60px', height: '60px', objectFit: 'cover'}}/></td>
                        <td>{item.brand}</td>
                        <td>{item.category}</td>
                        <td>
                            <button
                                onClick={() => handleDelete(item._id)}
                                style={{
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
