import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,  // 设置你的 API 基础路径
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // 从本地存储中获取 token

    if (token) {
      // 如果 token 存在，设置 Authorization 请求头
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // 如果没有 token，则不做处理，等待组件级的跳转
    }

    return config;
  },
  (error) => {
    // 只要请求过程中产生错误，就把错误error带到下一个阶段去
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
     // 只要收到的响应产生错误，就把错误error带到下一个阶段去
    return Promise.reject(error);
  }
);

export default axiosInstance;
