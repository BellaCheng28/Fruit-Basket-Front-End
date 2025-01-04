import { createContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Home from "./components/Home/Home";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService"; //
import ProductList from "./components/ProductList/ProductList";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import ProductForm from "./components/ProductForm/ProductForm";
import ReviewForm from "./components/ReviewForm/ReviewForm";
import Orders from "./components/Orders/Orders";
import OrdersPage from "./components/OrdersPage/OrdersPage";
import ShoppingCart from "./components/ShoppingCart.jsx/ShoppingCart";

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    if (token) {
      const currentUser = authService.getUser(); // 使用 token 获取用户信息
      setUser(currentUser); // 设置用户信息
    }
  }, []);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.product._id === product._id
      );
      if (existingProduct) {
        console.log(`Updated quantity for ${product.name}`);
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          product,
          quantity,
          purchasePrice: product.price,
          user_id: user._id,
          username: user.username,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    console.log("Removing product with id:", productId);
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product._id !== productId);
      console.log("Updated cart:", newCart); // 查看更新后的 cart
      return newCart;
    });
  };
  const clearCart = () => setCart([]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <AuthedUserContext.Provider
      value={{
        user,
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      <NavBar handleSignout={handleSignout} />
      <Routes>
        {/* public Routes: */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/products/productId/reviews" element={<ReviewForm />} />
        <Route path="/products/productId/reviews" element={<ReviewForm />} />

        <Route path="/cart" element={user ? <ShoppingCart /> : <Landing />} />
        <Route path="/orders" element={user ? <Orders /> : <Landing />} />
        <Route
          path="/orderslist"
          element={user ? <OrdersPage /> : <Landing />}
        />

        <Route path="/products/:productId/edit" element={<ProductForm />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/orders" />

        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </AuthedUserContext.Provider>
  );
};

export default App;
