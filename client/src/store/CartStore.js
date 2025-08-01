import { create } from 'zustand';
import axios  from "axios";
import {unauthorized} from "../utility/utility.js";


const CartStore=create((set)=>({

    isCartSubmit:false,

    CartForm:{productID:"",color:"",size:""},

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

    CartListRequest:async()=>{
        try {
            let res=await axios.get(`/api/CartList`);
            set({CartList:res.data['data']})
            set({CartCount:(res.data['data']).length})
            let total=0
            let vat=0
            let payable=0
            res.data['data'].forEach((item,i)=>{
                if(item['product']['discount']===true){
                    total=total+parseInt(item['qty'])*parseInt(item['product']['discountPrice'])
                }else{
                    total=total+parseInt(item['qty'])*parseInt(item['product']['price'])
                }
            })

            vat=total*0.05
            payable=vat+total
            set({CartTotal:total})
            set({CartVatTotal:vat})
            set({CartPayableTotal:payable})

        }catch (e) {
            unauthorized(e.response.status)
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




    CreateInvoiceRequest:async()=>{
        try {
            set({isCartSubmit:true})
            let res=await axios.get(`/api/CreateInvoice`);
            window.location.href=res.data['data']['GatewayPageURL'];
        }catch (e) {
            unauthorized(e.response.status)
        }finally {
            set({isCartSubmit:false})
        }
    },






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