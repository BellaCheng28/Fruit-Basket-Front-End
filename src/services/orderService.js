const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}`;
import { jwtDecode } from "jwt-decode";

const request = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found. Please log in.");
  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Request failed");
    }
    return res.json();
  } catch (error) {
    console.error("Request error:", error.message);
    throw error;
  }
};

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  try {
    const decoded = jwtDecode(token);
    
    if (!decoded || !decoded.role) {
      throw new Error("Invalid token format or role missing.");
    }
    return decoded.id;  //new
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    throw new Error("Invalid token. Please log in again.");
  }
};

const getAllOrders = async () => {
  const userId = getUserId(); // 获取当前用户 ID
  return request(`${BASE_URL}/orders`, {
    method: "GET",
  });
};


 const showOrder = (orderId) => {
 
  return request(`${BASE_URL}/orders/${orderId}`, {
    method: "GET",
  });
};

const createOrder = async (orderFormData) => {
  return request(`${BASE_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(orderFormData),
  });
};



export { getAllOrders, showOrder, createOrder };