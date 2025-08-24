import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductStore from "../../store/ProductStore";
import axios from "axios";
import "../../assets/css/main.css";

const potColorOptions = ["Terracotta", "Metallic", "White", "Ceramic", "Black", "Fiber"];
const plantSizeOptions = ["Small", "Medium", "Large"];
const backendURL = "http://localhost:3000";

const AddProduct = () => {
    const { BrandList, BrandListRequest, CategoryList, CategoryListRequest } = ProductStore();

    const [form, setForm] = useState({
        title: "",
        shortDes: "",
        price: "",
        discount: false,
        discountPrice: "",
        categoryID: "",
        brandID: "",
        imgFile: null,
        imgFiles: Array(8).fill(null),
        potColor: [],
        plantSize: [],
        desAndCare: "",
        stock: true,
        star: 0,
        remark: "",
    });

    const [loading, setLoading] = useState(false);
    const [savedImages, setSavedImages] = useState({});

    useEffect(() => {
        CategoryListRequest();
        BrandListRequest();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox" && (name === "potColor" || name === "plantSize")) {
            setForm((prev) => {
                const arr = prev[name] || [];
                if (checked) return { ...prev, [name]: [...arr, value] };
                else return { ...prev, [name]: arr.filter((v) => v !== value) };
            });
        } else if (type === "file") {
            if (name === "imgFile") setForm((prev) => ({ ...prev, imgFile: files[0] }));
            else if (name.startsWith("imgFiles")) {
                const idx = parseInt(name.split("-")[1]);
                const newFiles = [...form.imgFiles];
                newFiles[idx] = files[0];
                setForm((prev) => ({ ...prev, imgFiles: newFiles }));
            }
        } else if (type === "checkbox" && (name === "discount" || name === "stock")) {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title) return toast.error("Title is required");
        if (!form.price) return toast.error("Price is required");
        if (!form.imgFile) return toast.error("Main image is required");
        if (!form.categoryID) return toast.error("Select a category");
        if (!form.brandID) return toast.error("Select a brand");
        if (form.discount && !form.discountPrice) return toast.error("Discount price required");

        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (key === "imgFiles") {
                    form[key].forEach((file, idx) => {
                        if (file) formData.append(`img${idx + 1}`, file);
                    });
                } else if (key === "potColor" || key === "plantSize") {
                    formData.append(key, form[key].join(","));
                } else if (key === "imgFile") {
                    if (form[key]) formData.append("img", form[key]);
                } else formData.append(key, form[key]);
            });

            const res = await axios.post(`${backendURL}/api/ProductCreate`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.status === "success") {
                toast.success("✅ Product added successfully!");
                setSavedImages(res.data.details); // use details directly
            } else {
                toast.error("❌ Failed to add product");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to create product. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className="add-product-form">

                <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Enter Product Title" />
                </div>

                <div className="form-group">
                    <label>Short Description</label>
                    <input name="shortDes" value={form.shortDes} onChange={handleChange} placeholder="Enter Short Description" />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Enter Price" />
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="discount" checked={form.discount} onChange={handleChange} /> Has Discount?
                    </label>
                    {form.discount && (
                        <input
                            name="discountPrice"
                            type="number"
                            value={form.discountPrice}
                            onChange={handleChange}
                            placeholder="Discount Price"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select name="categoryID" value={form.categoryID} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {CategoryList.map((c) => (
                            <option key={c._id} value={c._id}>{c.name || c.categoryName}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Brand</label>
                    <select name="brandID" value={form.brandID} onChange={handleChange}>
                        <option value="">Select Brand</option>
                        {BrandList.map((b) => (
                            <option key={b._id} value={b._id}>{b.name || b.brandName}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="stock" checked={form.stock} onChange={handleChange} /> In Stock?
                    </label>
                </div>

                <div className="form-group">
                    <label>Star Rating (0-5)</label>
                    <input type="number" name="star" value={form.star} onChange={handleChange} min="0" max="5" />
                </div>

                <div className="form-group">
                    <label>Remark</label>
                    <input name="remark" value={form.remark} onChange={handleChange} />
                </div>

                <div className="form-group file-group">
                    <label>Main Image</label>
                    <input type="file" name="imgFile" onChange={handleChange} accept="image/*" />
                    {form.imgFile && <img src={URL.createObjectURL(form.imgFile)} alt="Main Preview" width="120" />}
                    {savedImages.img && <img src={`${backendURL}${savedImages.img}`} alt="Saved Main" width="120" />}
                </div>

                <div className="form-group file-group">
                    <label>Additional Images</label>
                    <div className="d-flex gap-2 flex-wrap">
                        {form.imgFiles.map((file, idx) => (
                            <div key={idx}>
                                <input type="file" name={`imgFiles-${idx}`} onChange={handleChange} accept="image/*" />
                                {file && <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} width="100" />}
                            </div>
                        ))}
                        {Array.from({ length: 8 }).map((_, i) => {
                            const imgPath = savedImages[`img${i + 1}`];
                            return imgPath ? <img key={i} src={`${backendURL}${imgPath}`} alt={`Saved ${i + 1}`} width="100" /> : null;
                        })}
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <label>Pot Colors</label>
                    <div className="d-flex gap-3 flex-wrap">
                        {potColorOptions.map((color) => (
                            <label key={color}>
                                <input type="checkbox" name="potColor" value={color} checked={form.potColor.includes(color)} onChange={handleChange} /> {color}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <label>Plant Sizes</label>
                    <div className="d-flex gap-3 flex-wrap">
                        {plantSizeOptions.map((size) => (
                            <label key={size}>
                                <input type="checkbox" name="plantSize" value={size} checked={form.plantSize.includes(size)} onChange={handleChange} /> {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Description & Care</label>
                    <textarea name="desAndCare" value={form.desAndCare} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Product"}</button>
            </form>
        </div>
    );
};

export default AddProduct;
