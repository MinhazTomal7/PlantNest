// src/store/DashboardStore.js
import { create } from 'zustand';
import axios from 'axios';

const DashboardStore = create((set) => ({
    summary: null,
    loading: false,
    error: null,

    fetchDashboardSummary: async () => {
        try {
            set({ loading: true });

            const res = await axios.get('http://localhost:3000/api/AdminDashboardSummary');
            console.log("✅ DASHBOARD API RESPONSE:", res.data); // <-- Add this

            set({ summary: res.data.data, loading: false });
        } catch (err) {
            console.error("❌ Dashboard API Error:", err);
            set({ error: err.message, loading: false });
        }
    },

}));

export default DashboardStore;
