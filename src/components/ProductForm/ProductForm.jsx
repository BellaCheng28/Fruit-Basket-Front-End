import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";

const ProductForm = ({ products,setProducts }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    price: "",
    description: "",
  });

  const user = useContext(AuthedUserContext); // get user
  const [isAdmin, setIsAdmin] = useState(false);
  const isEditMode = !!productId;

  //check user role
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const role = productService.getUserRole();
        setIsAdmin(role === "admin");
      } catch (error) {
        console.error("Error getting user role:", error.message);
      }
    };
    checkAdminRole();
  }, []);

  // Initialize form data
  useEffect(() => {
    if (!isEditMode) return;

    const initializeFormData = async () => {
      const product = location.state?.product;
      // Get product from state if passed
      if (product) {
        setFormData({
          name: product.name,
          image_url: product.image_url,
          price: product.price,
          description: product.description,
        });
      } else {
        // Fetch product if not passed
        try {
          const productData = await productService.showProduct(productId);
          setFormData({
            name: productData.name,
            image_url: productData.image_url,
            price: productData.price,
            description: productData.description,
          });
        } catch (error) {
          console.error("Failed to fetch product data:", error.message);
        }
      }
    };
    initializeFormData();
  }, [isEditMode, productId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await productService.updateProduct(productId, formData);
        alert("Product updated successfully.");
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, ...formData } : product
          )
        );
      } else {
        await productService.createProduct(formData);
        alert("New product created successfully.");
        setProducts((prevProducts) => [...prevProducts, formData]);
      }

      navigate("/products"); // Redirect to product list
    } catch (error) {
      console.error("Failed to save product:", error.message);
      alert("Failed to save product.");
    }
  };

  if (!isAdmin) {
    return <div>You are not authorized to create a product.</div>;
  }
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2>{isEditMode ? "Edit Product" : "Create New Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image_url">Image URL:</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">
          {isEditMode ? "Save Changes" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
 







     

