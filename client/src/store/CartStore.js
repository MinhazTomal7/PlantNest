import { create } from 'zustand';
import axios  from "axios";
import {unauthorized} from "../utility/utility.js";
import toast from "react-hot-toast";


const CartStore=create((set)=>({

    isCartSubmit:false,

    CartForm: {
        productID: "",
        potColor: "",
        plantSize: ""
    },


    CartFormChange:(name,value)=>{
        set((state)=>({
            CartForm:{
                ...state.CartForm,
                [name]:value
            }
        }))
    },

    CartSaveRequest:async(PostBody,productID,quantity)=>{
        try {
            set({isCartSubmit:true})
            PostBody.productID=productID
            PostBody.qty=quantity
            let res=await axios.post(`/api/SaveCartList`,PostBody);
            return res.data['status'] === "success";
        }catch (e) {
            unauthorized(e.response.status)
        }finally {
            set({isCartSubmit:false})
        }
    },



    CartList:null,
    CartCount:0,
    CartTotal:0,
    CartVatTotal:0,
    CartPayableTotal:0,

    CartListRequest: async () => {
        try {
            let res = await axios.get(`/api/CartList`);
            set({ CartList: res.data['data'] });
            set({ CartCount: (res.data['data']).length });

            const sizePriceMap = {
                Small: 0,
                Medium: 50,
                Large: 100,
            };

            const potColorPriceMap = {
                Default: 0,
                White: 30,
                Metallic: 60,
            };

            const ratePerMonth = 0.02; // 2% monthly depreciation

            let total = 0;

            res.data['data'].forEach(item => {
                const createdAt = new Date(item.product.createdAt);
                const now = new Date();

                // Calculate difference in days
                const diffTime = now - createdAt; // milliseconds
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                // Convert monthly rate to daily compound rate
                const dailyRate = 1 - Math.pow(1 - ratePerMonth, 1 / 30);

                const originalBasePrice = item.product.discount
                    ? Number(item.product.discountPrice)
                    : Number(item.product.price);

                // Calculate depreciated price using daily compound formula
                const depreciatedPrice = Math.max(
                    Math.ceil(originalBasePrice * Math.pow(1 - dailyRate, diffDays)),
                    1
                );


                const extraSize = sizePriceMap[item.plantSize] || 0;
                const extraColor = potColorPriceMap[item.potColor] || 0;

                const finalPrice = depreciatedPrice + extraSize + extraColor;

                total += parseInt(item.qty) * finalPrice;
            });

            const vat = Math.ceil(total * 0.05);
            const payable = total + vat;

            set({ CartTotal: total });
            set({ CartVatTotal: vat });
            set({ CartPayableTotal: payable });

        } catch (e) {
            unauthorized(e.response.status);
        }
    },





    RemoveCartListRequest:async(cartID)=>{
        try {
            set({CartList:null})
            await axios.post(`/api/RemoveCartList`,{"_id":cartID});
        }catch (e) {
            unauthorized(e.response.status)
        }
    },




    CreateInvoiceRequest: async () => {
        try {
            set({ isCartSubmit: true });

            let res = await axios.get(`/api/CreateInvoice`);
            console.log("CreateInvoice API response:", res);

            const gatewayURL = res?.data?.data?.GatewayPageURL;
            const responseStatus = res?.data?.data?.status;

            if (responseStatus === "SUCCESS" && gatewayURL) {
                window.location.href = gatewayURL;
            } else {
                toast.error("Payment gateway URL not found. Please try again.");
                console.log("Missing Gateway URL or unsuccessful response:", res.data);
            }

        } catch (e) {
            unauthorized(e?.response?.status || 500);
        } finally {
            set({ isCartSubmit: false });
        }
    }
,








    InvoiceList:null,
    InvoiceListRequest:async()=>{
        try {
            let res=await axios.get(`/api/InvoiceList`);
            set({InvoiceList:res.data['data']})
        }catch (e) {
            unauthorized(e.response.status)
        }finally {
        }
    },


    InvoiceDetails:null,
    InvoiceDetailsRequest:async(id)=>{
        try {
            let res=await axios.get(`/api/InvoiceProductList/${id}`);
            set({InvoiceDetails:res.data['data']})
        }catch (e) {
            unauthorized(e.response.status)
        }finally {
        }
    }


}))

export default CartStore;