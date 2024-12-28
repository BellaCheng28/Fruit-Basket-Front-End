import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";
import uploadFileToCloudinary from "../../services/cloudinaryService";

const ProductForm = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    price: "",
    description: "",
    image: null, // 添加 image 字段
  });

  // const [image, setImage] = useState(null);
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
          price: parseFloat(product.price),
          description: product.description,
          
        });
      } else {
        // Fetch product if not passed
        try {
          const productData = await productService.showProduct(productId);
          setFormData({
            name: productData.name,
            image_url: productData.image_url,
            price: parseFloat(productData.price),
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
    // console.log('name',value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file, // Save the selected file to formData.image
    }));
  };

  useEffect(() => {
    if (formData.image) {
      const uploadImage = async () => {
       try {
          const imageUrl = await uploadFileToCloudinary(formData.image, formData.name); // 传递产品名称
          console.log("Uploaded Image URL:", imageUrl);
          setFormData((prev) => ({ ...prev, image_url: imageUrl }));
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };

      uploadImage();
    }
  }, [formData.image]); // Only trigger this when formData.image changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    if (!formData.name || !formData.image_url) {
      console.error("Product name and image are required!");
      return;
    }
    try {
      
      // 准备提交的数据，确保 image_url 已正确设置
     const { image, ...productData } = formData;
     productData.price = price; 
    console.log("Product Data to send:", productData);
    console.log(typeof price);
   
      // 创建或更新商品
      if (isEditMode) {
        await productService.updateProduct(productId, productData);
        alert("Product updated successfully.");
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, ...productData }
              : product
          )
        );
      } else {
        await productService.createProduct(productData);
        alert("New product created successfully.");
        setProducts((prevProducts) => [...prevProducts, productData]);
       
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
          <label htmlFor="image_url">Image:</label>
          <input
            type="file"
            id="image_url"
            name="image_url"
            onChange={handleImageChange}
          />
          {formData.image && (
            <img src={URL.createObjectURL(formData.image)} alt="Uploaded" />
          )}
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
