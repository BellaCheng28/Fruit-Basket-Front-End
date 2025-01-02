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
import * as productService from "./services/productService";
import ReviewForm from "./components/ReviewForm/ReviewForm";
import Orders from "./components/Orders/Orders";
import OrdersPage from "./components/OrdersPage/OrdersPage";
import ShoppingCart from "./components/ShoppingCart.jsx/ShoppingCart";


export const AuthedUserContext = createContext(null); // set the initial value of the context to null
export const cartContext = createContext();

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
 
  useEffect(() => {
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    if (token) {
      const currentUser = authService.getUser(); // 使用 token 获取用户信息
      setUser(currentUser); // 设置用户信息
    }
  }, []);

const fetchProducts = async () => {
  try {
    const products = await productService.allProducts();
    setProducts(products);
  } catch (error) {
    setProducts([]);
  }
};
// 在组件加载时获取产品
useEffect(() => {
  fetchProducts();
}, []); // 仅在组件首次渲染时执行一次

// 创建新产品后更新父组件的产品列表
const handleCreateProduct = (newProduct) => {
  setProducts((prevProducts) => [...prevProducts, newProduct]); // 添加新产品到列表
};

// 编辑产品的回调函数
const handleEditProduct = (editedProduct) => {
  setProducts((prevProducts) =>
    prevProducts.map((product) =>
      product._id === editedProduct._id ? editedProduct : product
    )
  );
};
// 删除产品后更新父组件的产品列表
const handleDeleteProduct = (productId) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product._id !== productId)
  ); // 删除指定产品
};

  const addToCart = (product, quantity) => {
    if (!user) {
      // 如果没有用户信息，提示用户登录
      alert("Please log in to add items to your cart.");
      return;
    }
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
  // console.log("Cart :", cart);
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

  const isAdmin = user && user.role === "admin";
  const isCustomer = user && user.role === "customer";

  return (
    <AuthedUserContext.Provider
      value={{
        user,
        cart,
        products: products || [],
        addToCart,
        removeFromCart,
        clearCart,
        handleDeleteProduct,
        handleCreateProduct,
        handleEditProduct,
      }}
    >
      <NavBar handleSignout={handleSignout} />
      <Routes>
        {/* public Routes: */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Landing />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/products/productId/reviews" element={<ReviewForm />} />
        <Route path="/products/productId/reviews" element={<ReviewForm />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orderslist" element={<OrdersPage />} />
        <Route path="/home" element={<Home />} />

        {/* admin Routes */}
        {isAdmin && (
          <>
            <Route path="/products/:productId/edit" element={<ProductForm />} />
            <Route path="/products/new" element={<ProductForm />} />

            <Route path="/orders" />
          </>
        )}

        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </AuthedUserContext.Provider>
  );
};

export default App;
