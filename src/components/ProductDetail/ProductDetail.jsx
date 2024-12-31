import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";
import ReviewForm from "../ReviewForm/ReviewForm";
import * as orderService from "../../services/orderService";
const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // get URL productId
  const { user, addToCart, handleDeleteProduct } =
    useContext(AuthedUserContext);
  const [product, setProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  const user_id = user._id;
  // 确保用户信息和 productId 已经加载再发起请求
  console.log("Product ID from URL:", productId);
  useEffect(() => {
    if (!productId || !user) return;
    const fetchProductDetails = async () => {
      try {
        // 获取商品信息

        const productData = await productService.showProduct(productId);
        console.log("productData", productData);
        setProduct(productData);
        // setReviews(productData.reviews || []);

        const reviewsData = await productService.showReview(productId);
        const reviewsWithUsernames = await Promise.all(
          reviewsData.map(async (review) => {
            console.log("reviewsData", reviewsData);
            const username =
              review.user_id && review.user_id.username
                ? review.user_id.username
                : "Unknown";
            return {
              ...review,
              username,
            };
          })
        );
        setReviews(reviewsWithUsernames);

        // 设置管理员权限
        const role = productService.getUserRole();
        setIsAdmin(role === "admin");
        // 获取用户ID
        const userId = productService.getUserId();
        setUserId(userId);
        //检查用户是否购买过该商品
        const orders = await orderService.getAllOrders();
        console.log("Orders:", orders);
        const purchased = orders.some((order) =>
          order.orderItems_id.some((item) => item.product_id._id === productId)
        );
        // console.log("Order Items:", orderItems_id);
        console.log("Has purchased:", purchased);
        setHasPurchased(purchased);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [productId, user]); // 仅当 productId 或 user 发生变化时才触发

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productService.deleteProduct(productId), // 删除商品
        alert("Product deleted successfully.");
      handleDeleteProduct(productId);
      navigate("/products");
    } catch (error) {
      alert("Failed to delete product.");
      console.error("Error deleting product:", error.message);
    }
  };
  const handleEdit = () => {
    navigate(`/products/${productId}/edit`, { state: { product } });
  };
  const handleAddToCart = () => {
    if (quantity === 0) {
      alert("Please select a quantity greater than 0.");
      return;
    }
    addToCart(product, quantity);
    alert(`${quantity} of ${product.name} added to cart!`);
  };
  const handleAddReview = async (reviewFormData) => {
    try {
      const reviewData = {
        text: reviewFormData.text,
        user_id: user._id,
        username: user.username,
        product_id: productId,
      };
      console.log("Submitting review data:", reviewData);

      const newReview = await productService.createReview(
        productId,
        reviewData
      );
      setReviews((PrevReviews) => [...PrevReviews, newReview]);
      setReviewFormVisible(false);
    } catch (error) {}
  };

  if (!product) return <div>Product not found</div>;
  return (
    <>
      <div className="flex items-center flex-col justify-center p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
        
        <img
          src={product.image_url}
          alt={product.name}
          className="mt-4 w-[300px] h-[300px] rounded-md"
        />
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-xl font-bold text-gray-900 mt-4">
          Price: ${product.price} / LB
        </p>

        {/* Quantity Control */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            -
          </button>
          <span className="text-xl">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full p-4 bg-lime-600 text-white py-2 rounded-md hover:bg-lime-500 transition"
          >
            Add to cart
          </button>
        </div>

        {/* Admin Buttons */}
        {isAdmin && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-400 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-400 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center flex-col justify-center p-6 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>

        {/* Write a Review Button */}
        {hasPurchased && (
          <button
            onClick={() => setReviewFormVisible(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-400 transition"
          >
            Write a Review
          </button>
        )}

        {/* Review Form */}
        {isReviewFormVisible && (
          <div className="mt-4">
            <ReviewForm handleAddReview={handleAddReview} />
          </div>
        )}

        {/* No Reviews Message */}
        {reviews.length === 0 && (
          <p className="text-gray-500 mt-4">There are no Reviews.</p>
        )}

        {/* Review List */}
        {reviews.map((review) => (
          <article
            key={review._id}
            className="border-t pt-4 mt-4 first:border-t-0"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {review.username}
            </h3>
            <p className="text-gray-600 mt-2">{review.text}</p>
          </article>
        ))}
      </div>
    </>
  );
};
export default ProductDetail;
