import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";
import uploadFileToCloudinary from "../../services/cloudinaryService";

const ProductForm = () => {
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

  const { user, handleEditProduct, handleCreateProduct } =
    useContext(AuthedUserContext);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const isEditMode = !!productId;

  //check user role
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        
      } catch (error) {
        console.error("Error getting user role:", error.message);
      }
    };
    checkAdminRole();
  }, []);

  // Initialize form data for edit mode
  useEffect(() => {
   const checkAdminRoleAndInitializeForm = async()=>{
    try {
      // Check if the user is admin
      const role = productService.getUserRole();
      setIsAdmin(role === "admin");
      // Initialize form data if in edit mode
   if (isEditMode){
      const product =
        location.state?.product ||
        (await productService.showProduct(productId));
      setFormData({
            ...product,
            price: parseFloat(product.price),
          });
        }
  
    } catch (error) {
      console.error("Error:", error.message);
      setIsAdmin(false);  // Default to non-admin 
    }
   };
      checkAdminRoleAndInitializeForm();
  }, [isEditMode, productId, location.state]);
  

  // Handle form data change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    // console.log('name',value)
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file, // Save the selected file to formData.image
    }));
  };

  // Upload image to Cloudinary when file is selected
  useEffect(() => {
    if (formData.image) {
      const uploadImage = async () => {
        try {
          const imageUrl = await uploadFileToCloudinary(
            formData.image,
            formData.name
          ); // 传递产品名称
          // console.log("Uploaded Image URL:", imageUrl);
          setFormData((prev) => ({ ...prev, image_url: imageUrl }));
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };

      uploadImage();
    }
  }, [formData.image]); // Only trigger this when formData.image changes


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.image_url) {
      console.error("Product name and image are required!");
      return;
    }

    const productData = { ...formData, price: parseFloat(formData.price) };
    try {
      // 准备提交的数据，确保 image_url 已正确设置
      // const { image, ...productData } = formData;
      // productData.price = price;
      

      // 创建或更新商品
      if (isEditMode) {
        const EditProduct= await productService.updateProduct(productId, productData);
        alert("Product updated successfully.");
        handleEditProduct(EditProduct);
      } else {
        const createdProduct = await productService.createProduct(productData);
        alert("New product created successfully.");
        handleCreateProduct(createdProduct);
        
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

  const handleCancel = () => {
    navigate(`/products/${productId}`);
  }; 

  return (
    <div className="flex min-h-screen justify-center items-center  bg-white py-12  flex-col">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isEditMode ? "Edit Product" : "Create New Product"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-[#fafaf6] rounded-lg shadow-lg space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700"
          >
            Image:
          </label>
          <input
            type="file"
            id="image_url"
            name="image_url"
            onChange={handleImageChange}
            className="mt-1 block w-full  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
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
            className="mt-1 block w-full  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 disabled:bg-gray-400"
        >
          {isEditMode ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
