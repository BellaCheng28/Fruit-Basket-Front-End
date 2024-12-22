const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/products`;
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

//get roles
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.role) {
      throw new Error("Invalid token format or role missing.");
    }
    return decoded.role;
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    throw new Error("Invalid token. Please log in again.");
  }
};

const allProducts = () => request(BASE_URL);

const showProduct = (productId) => {
  return request(`${BASE_URL}/${productId}`, {
    method: "GET",
  });
};

const createProduct = async (productFormData) => {
  const role = getUserRole();
  if (role !== "admin")
    throw new Error("Permission denied.Only admins can create products.");
  return request(`${BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(productFormData),
  });
};

const updateProduct = (productId, productFormData) => {
  const role = getUserRole();
  if (role !== "admin")
    throw new Error("Permission denied.Only admins can create products.");
  return request(`${BASE_URL}/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productFormData),
  });
};

const deleteProduct = (productId) => {
  const role = getUserRole();
  if (role !== "admin")
    throw new Error("Permission denied.Only admins can create products.");
  return request(`${BASE_URL}/${productId}`, {
    method: "DELETE",
  });
};

const allReviews = () => request(`${BASE_URL}/${productId}/reviews`);

const showReview = (productId, reviewId) => {
  return request(`${BASE_URL}/${productId}/reviews/${reviewId}`, {
    method: "GET",
  });
};


const createReview = async(productId,reviewFormData) =>{
     const role = getUserRole();
     return request(`${BASE_URL}/${productId}/reviews`, {
       method: "POST",
       body: JSON.stringify(reviewFormData),
     }); 
  }

const updateReview = async (productId, reviewId) => {
  const role = getUserRole();
  return request(`${BASE_URL}/${productId}/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(reviewFormData),
  });
};

const deleteReview = async (productId, reviewId) => {
  const role = getUserRole();
  return request(`${BASE_URL}/${productId}/reviews/${reviewId}`, {
    method: "DELETE",
    body: JSON.stringify(reviewFormData),
  });
};



export {
  getUserRole,
  allProducts,
  showProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  allReviews,
  createReview,
  updateReview,
  deleteReview,
};
