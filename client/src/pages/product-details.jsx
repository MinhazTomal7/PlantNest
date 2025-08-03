import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/layout.jsx";
import Details from "../components/product/details.jsx";
import Brands from "../components/product/brands.jsx";
import ProductStore from "../store/ProductStore.js";

const ProductDetails = () => {
    const {
        BrandList,
        DetailsRequest,
        ReviewListRequest,
        BrandListRequest,
    } = ProductStore();
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            if (id) {
                await DetailsRequest(id);
                await ReviewListRequest(id);
            }
            if (!BrandList) {
                await BrandListRequest();
            }
        })();
    }, [id]);

    return (
        <>
            <Details />
            <Brands />
        </>
    );
};

export default ProductDetails;
