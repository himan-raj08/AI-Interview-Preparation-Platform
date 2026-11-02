import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});


export const register = async (data) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
};

export const login = async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
};

export const logout = async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/api/auth/get-me");
    return response.data;
};