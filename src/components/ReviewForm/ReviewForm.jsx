import { useState, useContext } from "react";
import { AuthedUserContext } from "../../App";
import { useNavigate } from "react-router-dom";
// import * as productService from "../../services/productService";

const ReviewForm = ({ handleAddReview }) => {
  const { user } = useContext(AuthedUserContext);
  // const { productId, reviewId } = useParams();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <label
        htmlFor="text-input"
        className="block text-sm font-medium text-gray-700"
      >
        Your comment:
      </label>
      <textarea
        required
        type="text"
        name="text"
        id="text-input"
        value={formData.text}
        onChange={handleChange}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 disabled:bg-gray-400"
      >
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
