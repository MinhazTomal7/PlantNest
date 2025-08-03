import { create } from 'zustand';
import axios from 'axios';
import { getEmail, setEmail, unauthorized } from '../utility/utility.js';
import Cookies from 'js-cookie';

const UserStore = create((set) => ({

    // Auth check
    isLogin: () => {
        return !!Cookies.get('token');
    },

    // Login form
    LoginFormData: { email: '' },
    LoginFormOnChange: (name, value) => {
        set((state) => ({
            LoginFormData: {
                ...state.LoginFormData,
                [name]: value,
            },
        }));
    },

    // OTP
    OTPFormData: { otp: '' },
    OTPFormOnChange: (name, value) => {
        set((state) => ({
            OTPFormData: {
                ...state.OTPFormData,
                [name]: value,
            },
        }));
    },

    // Form submit flag
    isFormSubmit: false,

    // Send OTP
    UserOTPRequest: async (email) => {
        set({ isFormSubmit: true });
        let res = await axios.get(`/api/UserOTP/${email}`, { withCredentials: true });
        setEmail(email);
        set({ isFormSubmit: false });
        return res.data['status'] === 'success';
    },

    // Verify OTP
    VerifyOTPRequest: async (otp) => {
        set({ isFormSubmit: true });
        let email = getEmail();
        let res = await axios.get(`/api/VerifyOTP/${email}/${otp}`, { withCredentials: true });
        set({ isFormSubmit: false });
        return res.data['status'] === 'success';
    },

    // Logout
    UserLogoutRequest: async () => {
        set({ isFormSubmit: true });
        let res = await axios.get(`/api/UserLogout`, { withCredentials: true });
        set({ isFormSubmit: false });
        return res.data['status'] === 'success';
    },

    // Profile Form state
    ProfileForm: {
        cus_add: '',
        cus_city: '',
        cus_country: '',
        cus_fax: '',
        cus_name: '',
        cus_phone: '',
        cus_postcode: '',
        cus_state: '',
        ship_add: '',
        ship_city: '',
        ship_country: '',
        ship_name: '',
        ship_phone: '',
        ship_postcode: '',
        ship_state: '',
    },

    ProfileFormChange: (name, value) => {
        set((state) => ({
            ProfileForm: {
                ...state.ProfileForm,
                [name]: value,
            },
        }));
    },

    // Profile data
    ProfileDetails: null,

    // Read Profile
    ProfileDetailsRequest: async () => {
        try {
            let res = await axios.get(`/api/ReadProfile`, { withCredentials: true });
            const data = res?.data?.message;
            if (Array.isArray(data) && data.length > 0) {
                set({
                    ProfileDetails: data[0],
                    ProfileForm: data[0],
                });
            } else {
                set({ ProfileDetails: {} });
            }
        } catch (e) {
            unauthorized(e?.response?.status || 0);
        }
    },

    // Save Profile
    ProfileSaveRequest: async (PostBody) => {
        try {
            let res = await axios.post(`/api/UpdateProfile`, PostBody, { withCredentials: true });
            if (res.data['status'] === 'success') {
                await UserStore.getState().ProfileDetailsRequest();
                return true;
            }
            return false;
        } catch (e) {
            unauthorized(e?.response?.status || 0);
        }
    },
}));

export default UserStore;
