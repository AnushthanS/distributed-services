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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(`${API_URL.AUTH}/auth/token/refresh`, { refreshToken });
                localStorage.setItem("token", response.data.accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token is invalid, redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (serviceId, secret) => {
    const response = await axios.post(`${API_URL.AUTH}/auth/token`, { serviceId, secret });
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
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

export const createProduct = async (product) => {
    const response = await api.post(`${API_URL.CATALOG}/products`, product);
    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(`${API_URL.CATALOG}/products/${productId}`);
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.put(`${API_URL.ORDER}/orders/${orderId}`, { status });
    return response.data;
};