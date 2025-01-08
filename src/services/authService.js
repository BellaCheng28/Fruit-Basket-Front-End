import axiosInstance from "./middleware/axiosService";
const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const signup = async (formData) => {
  try {
    const res = await axiosInstance({
      method:"POST",
      url:`${BACKEND_URL}/users/signup`,
      headers: { "Content-Type": "application/json" },
      data: formData
    })

    // 判断是否包含 token
    if (res.data.token) {
      return { success: true, token: res.data.token };
    } else {
      return {
        success: false,
        message: json.error || "Unknown error occurred",
      };
    }
  } catch (err) {
    console.log(err);
    // 这里可以记录错误，提供更多调试信息
    console.error("Error during signup:", err);

    // 返回标准化的错误对象
    return {
      success: false,
      message: err.response.data.error || "Something went wrong, please try again later",
    };
  }
};

const signin = async (user) => {
  try {
    // 发送请求到后端
    const res = await fetch(`${BACKEND_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    // 检查响应的状态码
    if (!res.ok) {
      const errorData = await res.json();
      console.log(res);
      throw new Error(errorData.error || 'Signin failed, please try again.');
    }

    // 解析响应数据
    const json = await res.json();

    // 检查是否包含 token
    if (json.data && json.data.token) {
      const { token } = json.data;

      // 将 JWT token 存储到 localStorage
      localStorage.setItem("token", token);

      // 解码 JWT token 获取用户信息
      const decodedUser = decodeJwt(token); // 调用解码函数
      return { success: true, user: decodedUser };
    }

    // 如果没有 token 或返回错误信息，抛出错误
    if (json.err) {
      throw new Error(json.err);
    }

    // 如果没有其他信息，返回失败
    return { success: false, message: "Unknown error occurred." };

  } catch (err) {
    // 捕获错误并输出到控制台
    console.error("Signin error:", err);
    return {
      success: false,
      message: err.message || "Something went wrong, please try again later",
    };
  }
};

// JWT 解码函数
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1]; // 获取 token 中的 payload 部分
    const decoded = JSON.parse(atob(payload)); // 解码并解析
    return decoded;
  } catch (err) {
    console.error('JWT decoding error:', err);
    return null; // 返回 null 表示解码失败
  }
};


const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } 
  try {
    const user = JSON.parse(atob(token.split(".")[1]));
    // console.log("Decoded user from token:", user);
    return user;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

//get all userId
const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/users/${userId}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const signout = () => {
  localStorage.removeItem("token");
};

export { signup, signin, getUser, getUserById, signout };
