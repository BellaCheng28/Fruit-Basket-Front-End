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

    if (json.data.token) {
      localStorage.setItem("token", json.data.token); // add this line to store the JWT token in localStorage

      const user = JSON.parse(atob(json.data.token.split(".")[1]));

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
    console.log("Signin response:", json); 

    if (json.data.token) {
      localStorage.setItem("token", json.data.token); // add this line to store the JWT token in localStorage
      console.log("Token stored:", localStorage.getItem("token"));

      const user = JSON.parse(atob(json.data.token.split(".")[1]));

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
  if (!token) return null;
  const user = JSON.parse(atob(token.split(".")[1]));
  return user;
};

const signout = () => {
  localStorage.removeItem("token");
};

export { signup, signin, getUser, signout };
