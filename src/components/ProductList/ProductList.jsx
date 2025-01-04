import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";
const ProductList = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { products } = useContext(AuthedUserContext);

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

  const handleCreateProduct = () => {
    navigate("/products/new");
  };

  return (
    <>
      <main className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 place-items-center">
          {products.map((product) => {
            return (
              <Link
                className="bg-[#fafaf6] w-[160px] h-[250px] rounded-[10px]"
                key={product._id}
                to={`/products/${product._id}`}
              >
                <div className="rounded-lg  flex flex-col items-center justify-between">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-3/4 object-cover rounded-md"
                    />
                  )}
                  <div className="text-center p-3">
                    <p className="font-semibold text-lg truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-lime-600">
                      $ {product.price} / LB
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {isAdmin && (
          <div className="flex justify-center mt-5">
            <button
              onClick={handleCreateProduct}
              className="bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-500"
            >
              Create Product
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default ProductList;
