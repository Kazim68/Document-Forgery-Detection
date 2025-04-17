import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your backend URL

const authApi = {
  register: async (userData) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  },

  // New login method
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  verifyOtp: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/auth/verify-email`, data);
    return res.data;
  },
  resendOtp: async (email) => {
    const res = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
    return res.data;
  }
};

export default authApi;
