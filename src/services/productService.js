const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}`;
import { jwtDecode } from "jwt-decode";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found. Please log in.");
  return token;
};

const checkAdminRole = () => {
  const role = getUserRole();
  if (role !== "admin") {
    throw new Error("Permission denied. Only admins can perform this action.");
  }
};


const request = async (url, options = {}) => {
  const { method = "GET", body, headers = {} } = options;

  // 获取 token
  const token = getAuthToken();
 console.log("Authorization Token:", token);
  // 设置请求头
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json", // 默认 Content-Type 为 application/json
      Authorization: `Bearer ${token}`, // 添加 Authorization 头部
      ...headers, // 合并用户传入的其他 headers
    },
  };

  // 如果请求是 POST、PUT 或 DELETE 请求，并且有 body，处理 body
  if ((method === "POST" || method === "PUT") && body) {
    requestOptions.body = JSON.stringify(body); // 转化为 JSON 字符串
  }
 console.log("Request URL:", url);
 console.log("Request Options:", requestOptions); 
  try {
    const response = await fetch(url, requestOptions);

    // 如果响应不是成功的（即状态码不是 2xx），抛出错误
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Request failed");
    }

    // 返回 JSON 格式的响应数据
    return await response.json();
  } catch (error) {
    console.error("Request error:", error.message);
    throw error;
  }
};

  




  
//   const defaultHeaders = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   try {
//     const res = await fetch(url, {
//       ...options,
//       headers: { ...defaultHeaders, ...options.headers },
//       mode: "cors",
//     });
//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || "Request failed");
//     }
//     return res.json();
//   } catch (error) {
//     console.error("Request error:", error.message);
//     throw error;
//   }
// };

const getUserId = () => {
   const token = getAuthToken();
  try {
    const decoded = jwtDecode(token);
    return decoded.id; // 返回用户 ID
  } catch (error) {
    console.error("Failed to decode token:", error.message);
    throw new Error("Invalid token. Please log in again.");
  }
};


 const getUserRole = () => {
  const token = getAuthToken();
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

const allProducts = () => request(`${BASE_URL}/products`);

const showProduct = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  const response = await request(`${BASE_URL}/products/${productId}`);
  return response;
};


const createProduct = async (productData) => {
  checkAdminRole();
  return request(`${BASE_URL}/products`, {
    method: "POST",
    body: productData,
  });
};

const updateProduct = (productId, productData) => {
  checkAdminRole();
  return request(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    body: productData,
  });
};

const deleteProduct = (productId) => {
  checkAdminRole();
  return request(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });
};




// const allReviews = () => request(`${BASE_URL}/review`);

const showReview = (productId) => {
  if (!productId) {
    throw new Error("Product ID is required to fetch reviews.");
  }
  return request(`${BASE_URL}/review/${productId}`, {
    method: "GET",
  });
};

const createReview = async (productId, reviewFormData) => {
  //  const role = getUserRole();
  return request(`${BASE_URL}/review`, {
    method: "POST",
    body: JSON.stringify(reviewFormData),
  });
};

// const updateReview = async (productId, reviewId) => {
//   const role = getUserRole();
//   return request(`${BASE_URL}/${productId}/reviews/${reviewId}`, {
//     method: "PUT",
//     body: JSON.stringify(reviewFormData),
//   });
// };

// const deleteReview = async (productId, reviewId) => {
//   const role = getUserRole();
//   return request(`${BASE_URL}/${productId}/reviews/${reviewId}`, {
//     method: "DELETE",
//     body: JSON.stringify(reviewFormData),
//   });
// };
//  updateReview,
//   deleteReview,

export {
  getUserId,
  getUserRole,
  allProducts,
  showProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  showReview,
  createReview,
};
