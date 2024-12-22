import { Link,useNavigate, useNavigation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as productService from "../../services/productService";
const ProductList = ({ products }) => {
 
const[isAdmin,setIsAdmin]=useState(false);
const navigate =useNavigate()

useEffect(() => {
  const checkAdmin = async () => {
    try {
      const role = await productService.getUserRole(); 
      setIsAdmin(role === "admin"); 
    } catch (error) {
      console.error("Failed to check role:", error);
      setIsAdmin(false); // 默认设置为非管理员
    }
  };

  checkAdmin();
}, []);
const handleCreateProduct=()=>{
  navigate("/products/new");
}
  return (
    <>
      <main>
        <h1>Product List</h1>
        <div>
          {products.map((product) => {
            return (
              <Link key={product._id} to={`/products/${product._id}`}>
                {/* <p> {product.image_url && (
                  <img scr={product.image_url} alt={product.name} />
                )} </p> */}
                <p>{product.name}</p>
              </Link>
            );
          })}
        </div>
        {isAdmin && (
          <button onClick={handleCreateProduct}>Create Product</button>
        )}
      </main>
    </>
  );
};

export default ProductList;
