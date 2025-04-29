import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

export const adminLogin = (data) => axios.post(`${BASE_URL}/login`, data, {
    headers: {
        "Content-Type": "application/json"
    }
});
export const adminSignup = (data) => axios.post(`${BASE_URL}/signup`, data);
export const getAdminInfo = (token) => axios.get(`${BASE_URL}/info`, {
    headers: { Authorization: `Bearer ${token}` },
});
export const updateAdmin = (token, formData) => axios.put(`${BASE_URL}/update`, formData, {
    headers: { Authorization: `Bearer ${token}` },
});
export const getAdminList = () => axios.get(`${BASE_URL}/allinfo`);
export const deleteAdmin = (adid) => axios.put(`${BASE_URL}/delete?adid=${adid}`);
export const logoutAdmin = (token) => axios.get(`${BASE_URL}/logout`, {
    headers: { Authorization: `Bearer ${token}` },
});