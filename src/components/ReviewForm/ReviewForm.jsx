import { useState, useEffect, useContext } from "react";
import { AuthedUserContext } from "../../App";
import { useParams,useNavigate } from 'react-router-dom';
import * as productService from'../../services/productService';


const ReviewForm = () => {
  const { user } = useContext(AuthedUserContext);
  const { productId, reviewId } = useParams();
  const [formData, setFormData] = useState({
    text: "",
  });
  const navigate = useNavigate();
  const user_id = user._id;

 

  if (!user) {
    console.error("User not logged in.");
    navigate("/signin");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateReview(formData);
    setFormData({ text: "" });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await productService.showProduct(productId);
      setFormData(
        productData.reviews.find((review) => review._id === reviewId)
      );
    };
    if (productId && reviewId) fetchProduct();
  }, [productId, reviewId]);

  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your comment:</label>
      <textarea
        required
        type="text"
        name="text"
        id="text-input"
        value={formData.text}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};





export default ReviewForm;
