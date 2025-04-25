import axios from 'axios';

const API_BASE_URL = "https://shy-kathy-kazim68-5d662330.koyeb.app";

export const verifyRecaptcha = async (token) => {
    const res = await axios.post(`${API_BASE_URL}/security/verify-recaptcha`, {
      token,
    });
    return res.data;
  }