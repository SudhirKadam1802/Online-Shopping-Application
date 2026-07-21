import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7252",
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// Attach JWT Token    
// =========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
//manage token expiry
api.interceptors.response.use(
    response => {
        console.log("✅ API Success:", response.status);
        return response;
    },
    error => {

        console.log("❌ API Error:", error.response?.status);

        if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

    if (window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
}

        return Promise.reject(error);
    }
);
// =========================
// Authentication APIs
// =========================

export const registerUser = (user) =>
  api.post("/api/Auth/register", user);

export const loginUser = (user) =>
  api.post("/api/Auth/login", user);

// =========================
// Product APIs
// =========================

export const getProducts = () =>
  api.get("/api/Products");

export const createProduct = (product) =>
  api.post("/api/Products", product);

export const getProductById = (id) =>
  api.get(`/api/Products/${id}`);

export const deleteProduct = (id) =>
  api.delete(`/api/Products/${id}`);

// =========================
// Cart APIs
// =========================

export const createCart = () =>
  api.post("/api/Cart/create");

export const getCart = (cartId) =>
  api.get(`/api/Cart/${cartId}`);

export const addCartItem = (cartId, productId, quantity = 1) =>
  api.post(
    `/api/Cart/${cartId}/add-item?productId=${productId}&quantity=${quantity}`
  );

export const updateCartItem = (cartId, productId, quantity) =>
  api.put(
    `/api/Cart/${cartId}/update-item?productId=${productId}&quantity=${quantity}`
  );

export const removeCartItem = (cartId, productId) =>
  api.delete(
    `/api/Cart/${cartId}/remove-item?productId=${productId}`
  );

export const getCartSummary = (cartId) =>
  api.get(`/api/Cart/${cartId}/summary`);

export const clearCart = (cartId) =>
  api.delete(`/api/Cart/${cartId}/clear`);

export default api;