import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";
import ReviewForm from "../ReviewForm/ReviewForm";
import * as orderService from "../../services/orderService";
const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // get URL productId
  const { user, addToCart } = useContext(AuthedUserContext);
  const [product, setProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const user_id = user._id;
  // 确保用户信息和 productId 已经加载再发起请求
  useEffect(() => {
    if (!productId || !user) return;
    const fetchProductDetails = async () => {
      try {
        // 获取商品信息
        const productData = await productService.showProduct(productId);
        setProduct(productData);
        // setReviews(productData.reviews || []);

        const reviewsData = await productService.showReview(productId);
        const reviewsWithUsernames = await Promise.all(
          reviewsData.map(async (review) => {
            console.log("reviewsData",reviewsData);
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
        // 检查用户是否购买过该商品
        const orders = await orderService.getAllOrders();
        console.log("Orders:", orders);
        const purchased = orders.some((order) =>
          order.orderItems_id.some((item) => item.product_id._id === productId)
        );
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
      await productService.deleteProduct(productId);
      alert("Product deleted successfully.");
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

     const newReview = await productService.createReview(productId, reviewData);
     setReviews((PrevReviews)=>[...PrevReviews,newReview]);
    setReviewFormVisible(false);
   } catch (error) {
    
   }
  };

  if (!product) return <div>Product not found</div>;
  return (
    <>
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <img src={product.image_url} alt={product.name} />
        <p>Price: ${product.price}</p>
        <div>
          <button onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}>
            -
          </button>
          <span> {quantity} </span>
          <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
        {isAdmin && (
          <div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      <div>
        <h2>Reviews</h2>
        {hasPurchased && (
          <button onClick={() => setReviewFormVisible(true)}>
            Write a Review
          </button>
        )}
        {isReviewFormVisible && (
          <ReviewForm handleAddReview={handleAddReview} />
        )}
        {reviews.length === 0 && <p>There are no Reviews.</p>}
        {reviews.map((review) => (
          <article key={review._id}>
            <h3>{review.username}</h3>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </>
  );
};
export default ProductDetail;
