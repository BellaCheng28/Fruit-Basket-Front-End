import { useState, useEffect, useContext } from "react";
import { AuthedUserContext } from "../../App";
import { useParams,useNavigate } from 'react-router-dom';
import * as productService from'../../services/productService';


const ReviewForm = ({handleAddReview}) => {
  const { user } = useContext(AuthedUserContext);
  const { productId, reviewId } = useParams();
  const [formData, setFormData] = useState({
    text: "",
  });
  const navigate = useNavigate();
  // const user_id = user._id;

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
    handleAddReview(formData);
    setFormData({ text: "" });
  };

  
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
