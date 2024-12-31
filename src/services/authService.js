// src/services/authService.js
const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const signup = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    console.log("Response from backend:", json);
    if (json.token) {
      localStorage.setItem("token", json.token); // add this line to store the JWT token in localStorage

      const user = JSON.parse(atob(json.token.split(".")[1]));

      return user;
    }
    if (json.err) {
      throw new Error(json.err);
    }
    return json;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// src/services/authService.js

const signin = async (user) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const json = await res.json();
    // console.log("Signin response:", json); 

    if (json.token) {
      localStorage.setItem("token", json.token); // add this line to store the JWT token in localStorage
      

      const user = JSON.parse(atob(json.token.split(".")[1]));

      return user;
    }
    if (json.err) {
      throw new Error(json.err);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }   //新
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

export { signup, signin, getUser,getUserById, signout };
