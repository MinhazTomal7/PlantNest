import React from 'react';
import UserSubmitButton from "./UserSubmitButton.jsx";
import UserStore from "../../store/UserStore.js";
import ValidationHelper from "../../utility/ValidationHelper.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const OtpForm = () => {
    let navigate = useNavigate();

    let {OTPFormData,OTPFormOnChange,VerifyOTPRequest } = UserStore()

    const onFormSubmit =async ()=>{
        if(ValidationHelper.IsEmpty(OTPFormData.otp)){
            toast.error("Valid PIN Required")
        }
        else {
            let res = await VerifyOTPRequest(OTPFormData.otp);
            res?navigate("/"):toast.error("Something went wrong")
        }
    }


    return (
        <div className="container section">
            <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <div className="card p-5">
                        <h4>Enter Verification Code</h4>
                        <p>A verification code has been sent to the email address you provided</p>
                        <input value={OTPFormData.otp}
                               onChange={(e)=>
                               {OTPFormOnChange("otp", e.target.value)}}
                            placeholder="Verification Code" type="text" className="form-control" />
                        <UserSubmitButton onClick = {onFormSubmit} submit={false} className="btn mt-3 btn-success" text="Submit" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpForm;
