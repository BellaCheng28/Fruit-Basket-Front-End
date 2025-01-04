const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}`;
import { jwtDecode } from "jwt-decode";

const getAuthToken = () => {
  const token = localStorage.getItem("token")|| null;
  return token;
};


const request = async (url, options = {}) => {
  const { method = "GET", body, headers = {} } = options;

  // 获取 token
  const token = getAuthToken();
  //  console.log("Authorization Token:", token);
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
  //  console.log("Request URL:", url);
  //  console.log("Request Options:", requestOptions);
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

// const allProducts = () => request();

const allProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
const showProduct = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  const response = await request(`${BASE_URL}/products/${productId}`);
  return response;
};

const createProduct = async (productData) => {
  return request(`${BASE_URL}/products`, {
    method: "POST",
    body: productData,
  });
};

const updateProduct = (productId, productData) => {
  return request(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    body: productData,
  });
};

const deleteProduct = (productId) => {
  return request(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });
};


const showReview = (productId) => {
  if (!productId) {
    throw new Error("Product ID is required to fetch reviews.");
  }
  return request(`${BASE_URL}/review/${productId}`, {
    method: "GET",
  });
};

const createReview = async (reviewFormData) => {
  return request(`${BASE_URL}/review`, {
    method: "POST",
    body: reviewFormData,
  });
};


export {
  getUserId,
  allProducts,
  showProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  showReview,
  createReview,
};
