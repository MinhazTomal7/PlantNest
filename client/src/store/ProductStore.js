import { create } from 'zustand';
import axios from "axios";

const ProductStore = create((set) => ({

    BrandList: [],
    BrandListRequest: async () => {
        try {
            let res = await axios.get(`/api/ProductBrandList`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ BrandList: res.data['data'] });
            } else {
                set({ BrandList: [] });
            }
        } catch (error) {
            console.error("BrandListRequest error:", error);
            set({ BrandList: [] });
        }
    },

    CategoryList: [],
    CategoryListRequest: async () => {
        try {
            let res = await axios.get(`/api/ProductCategoryList`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ CategoryList: res.data['data'] });
            } else {
                set({ CategoryList: [] });
            }
        } catch (error) {
            console.error("CategoryListRequest error:", error);
            set({ CategoryList: [] });
        }
    },

    SliderList: [],
    SliderListRequest: async () => {
        try {
            let res = await axios.get(`/api/ProductSliderList`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ SliderList: res.data['data'] });
            } else {
                set({ SliderList: [] });
            }
        } catch (error) {
            console.error("SliderListRequest error:", error);
            set({ SliderList: [] });
        }
    },

    ListByRemark: [],
    ListByRemarkRequest: async (Remark) => {
        set({ ListByRemark: [] });
        try {
            let res = await axios.get(`/api/ProductListByRemark/${Remark}`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ ListByRemark: res.data['data'] });
            } else {
                set({ ListByRemark: [] });
            }
        } catch (error) {
            console.error("ListByRemarkRequest error:", error);
            set({ ListByRemark: [] });
        }
    },

    ListProduct: [],
    ListByBrandRequest: async (BrandID) => {
        set({ ListProduct: [] });
        try {
            let res = await axios.get(`/api/ProductListByBrand/${BrandID}`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ ListProduct: res.data['data'] });
            } else {
                set({ ListProduct: [] });
            }
        } catch (error) {
            console.error("ListByBrandRequest error:", error);
            set({ ListProduct: [] });
        }
    },

    ListByCategoryRequest: async (CategoryID) => {
        set({ ListProduct: [] });
        try {
            let res = await axios.get(`/api/ProductListByCategory/${CategoryID}`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ ListProduct: res.data['data'] });
            } else {
                set({ ListProduct: [] });
            }
        } catch (error) {
            console.error("ListByCategoryRequest error:", error);
            set({ ListProduct: [] });
        }
    },

    ListByKeywordRequest: async (Keyword) => {
        set({ ListProduct: [] });
        try {
            let res = await axios.get(`/api/ProductListByKeyword/${Keyword}`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ ListProduct: res.data['data'] });
            } else {
                set({ ListProduct: [] });
            }
        } catch (error) {
            console.error("ListByKeywordRequest error:", error);
            set({ ListProduct: [] });
        }
    },

    ListByFilterRequest: async (postBody) => {
        set({ ListProduct: [] });
        try {
            let res = await axios.post(`/api/ProductListByFilter`, postBody);
            if (res.data['status'].toLowerCase() === "success") {
                set({ ListProduct: res.data['data'] });
            } else {
                set({ ListProduct: [] });
            }
        } catch (error) {
            console.error("ListByFilterRequest error:", error);
            set({ ListProduct: [] });
        }
    },

    SearchKeyword: "",
    SetSearchKeyword: async (keyword) => {
        set({ SearchKeyword: keyword });
    },

    Details: null,
    DetailsRequest: async (id) => {
        try {
            let res = await axios.get(`/api/ProductDetails/${id}`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ Details: res.data['data'] });
            } else {
                set({ Details: null });
            }
        } catch (error) {
            console.error("DetailsRequest error:", error);
            set({ Details: null });
        }
    },

    ReviewList: [],
    ReviewListRequest: async (id) => {
        try {
            let res = await axios.get(`/api/ProductReviewList/${id}`);
            if (res.data['status'].toLowerCase() === "success") {
                set({ ReviewList: res.data['data'] });
            } else {
                set({ ReviewList: [] });
            }
        } catch (error) {
            console.error("ReviewListRequest error:", error);
            set({ ReviewList: [] });
        }
    },

}));

export default ProductStore;
