import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductStore from "../../store/ProductStore";
import axios from "axios";

const potColorOptions = [
    "Terracotta",
    "Metallic",
    "White",
    "Ceramic",
    "Black",
    "Fiber",
];

const plantSizeOptions = ["Small", "Medium", "Large"];

const AddProduct = () => {
    const {
        BrandList,
        BrandListRequest,
        CategoryList,
        CategoryListRequest,
    } = ProductStore();

    const [form, setForm] = useState({
        title: "",
        shortDes: "",
        price: "",
        discount: false,
        discountPrice: "",
        stock: false,
        star: "",
        remark: "",
        img: "",
        categoryID: "",
        brandID: "",
        img1: "",
        img2: "",
        img3: "",
        img4: "",
        img5: "",
        img6: "",
        img7: "",
        img8: "",
        potColor: [],
        plantSize: [],
        desAndCare: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        CategoryListRequest();
        BrandListRequest();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox" && (name === "discount" || name === "stock")) {
            // For discount and stock boolean checkboxes
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "checkbox" && (name === "potColor" || name === "plantSize")) {
            // For potColor and plantSize checkboxes (multiple selection)
            setForm((prev) => {
                const currentArr = prev[name] || [];
                if (checked) {
                    // Add to array
                    return { ...prev, [name]: [...currentArr, value] };
                } else {
                    // Remove from array
                    return {
                        ...prev,
                        [name]: currentArr.filter((v) => v !== value),
                    };
                }
            });
        } else {
            // For all other inputs (text, select single, etc)
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields with toast messages
        if (!form.title) {
            toast.error("❗ Title is required.");
            return;
        }
        if (!form.price) {
            toast.error("❗ Price is required.");
            return;
        }
        if (!form.img) {
            toast.error("❗ Main image URL is required.");
            return;
        }
        if (!form.categoryID) {
            toast.error("❗ Please select a category.");
            return;
        }
        if (!form.brandID) {
            toast.error("❗ Please select a brand.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                potColor: form.potColor.join(","),
                plantSize: form.plantSize.join(","),
                discount: !!form.discount,
                stock: !!form.stock,
            };

            const res = await axios.post("http://localhost:3000/api/ProductCreate", payload);

            if (res?.data?.status === "success" || res?.status === 200) {
                toast.success("✅ Product added successfully!");
                // Reset form after success
                setForm({
                    title: "",
                    shortDes: "",
                    price: "",
                    discount: false,
                    discountPrice: "",
                    stock: false,
                    star: "",
                    remark: "",
                    img: "",
                    categoryID: "",
                    brandID: "",
                    img1: "",
                    img2: "",
                    img3: "",
                    img4: "",
                    img5: "",
                    img6: "",
                    img7: "",
                    img8: "",
                    potColor: [],
                    plantSize: [],
                    desAndCare: "",
                });
            } else {
                toast.error("❌ Failed to add product.");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to create product.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />
                <input
                    name="shortDes"
                    value={form.shortDes}
                    onChange={handleChange}
                    placeholder="Short Description"
                />
                <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    type="number"
                    required
                />
                <input
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleChange}
                    placeholder="Discount Price"
                    type="number"
                />
                <input
                    name="img"
                    value={form.img}
                    onChange={handleChange}
                    placeholder="Main Image URL"
                    required
                />
                <input
                    name="star"
                    value={form.star}
                    onChange={handleChange}
                    placeholder="Star Rating (1–5)"
                    type="number"
                    min={1}
                    max={5}
                />

                <select
                    name="categoryID"
                    value={form.categoryID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    {(CategoryList || []).map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name || cat.categoryName}
                        </option>
                    ))}
                </select>

                <select
                    name="brandID"
                    value={form.brandID}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Brand</option>
                    {(BrandList || []).map((b) => (
                        <option key={b._id} value={b._id}>
                            {b.name || b.brandName}
                        </option>
                    ))}
                </select>

                <div className="full-width">
                    <label>
                        <input
                            type="checkbox"
                            name="discount"
                            checked={form.discount}
                            onChange={handleChange}
                        />
                        Discount
                    </label>
                    &nbsp;&nbsp;
                    <label>
                        <input
                            type="checkbox"
                            name="stock"
                            checked={form.stock}
                            onChange={handleChange}
                        />
                        In Stock
                    </label>
                </div>

                <select
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    className="full-width"
                >
                    <option value="">Select Remark</option>
                    <option value="top">Top</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Popular</option>
                    <option value="special">Special</option>
                    <option value="new">New</option>
                </select>

                <div className="full-width">
                    <h3>Additional Images (Optional)</h3>
                    {[...Array(8)].map((_, i) => (
                        <input
                            key={i}
                            name={`img${i + 1}`}
                            value={form[`img${i + 1}`]}
                            onChange={handleChange}
                            placeholder={`Image ${i + 1} URL`}
                        />
                    ))}
                </div>

                {/* Pot Colors checkboxes */}
                <div className="full-width">
                    <label>Pot Colors (Select one or more)</label>
                    <div>
                        {potColorOptions.map((color) => (
                            <label key={color} style={{ marginRight: "12px" }}>
                                <input
                                    type="checkbox"
                                    name="potColor"
                                    value={color}
                                    checked={form.potColor.includes(color)}
                                    onChange={handleChange}
                                />{" "}
                                {color}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Plant Sizes checkboxes */}
                <div className="full-width">
                    <label>Plant Sizes (Select one or more)</label>
                    <div>
                        {plantSizeOptions.map((size) => (
                            <label key={size} style={{ marginRight: "12px" }}>
                                <input
                                    type="checkbox"
                                    name="plantSize"
                                    value={size}
                                    checked={form.plantSize.includes(size)}
                                    onChange={handleChange}
                                />{" "}
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <textarea
                    name="desAndCare"
                    value={form.desAndCare}
                    onChange={handleChange}
                    placeholder="Description and Care Instructions (HTML allowed)"
                    className="full-width"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
