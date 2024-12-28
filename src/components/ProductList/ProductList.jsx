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
             if (!product._id) {
               console.warn("Product _id is missing", product);
             } else {
               console.log("Product ID:", product._id);
             }
            return (
              <Link key={product._id} to={`/products/${product._id}`}>
                <div>
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} />
                  )}
                  <p>{product.name}</p>
                  <p>{product.description}</p>
                </div>
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
