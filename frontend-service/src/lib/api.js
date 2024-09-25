import axios from "axios";

const API_URL = {
    AUTH: "http://localhost:2020",
    CATALOG: "http://localhost:2000",
    ORDER: "http://localhost:2001",
    INVENTORY: "http://localhost:2002"
};

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const login = async (serviceId, secret) => {
    const response = await axios.post(`${API_URL.AUTH}/auth/token`, { serviceId, secret })
    return response.data;
};

export const getProducts = async() => {
    const response = await api.get(`${API_URL.CATALOG}/products`);
    return response.data;
};

export const createOrder = async(order) => {
    const response = await api.post(`${API_URL.ORDER}/orders`, order);
    return response.data;
}

export const getOrders = async() => {
    const response = await api.get(`${API_URL.ORDER}/orders`);
    return response.data;
}

export const checkInventory = async (productId, quantity) => {
    const response = await api.post(`${API_URL.INVENTORY}/inventory`, { id: productId, requiredQuantity: quantity });
    return response.data;
}