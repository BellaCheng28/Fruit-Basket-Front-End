import { useEffect, useState, useContext } from "react";
import { useParams,useNavigate } from "react-router-dom";
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
  const user_id = user._id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.showProduct(productId); // get product detail
        setProduct(productData);
         if (productData) {
           setProduct(productData); // 仅当获取到数据时才设置
         } else {
           console.error("No product found for this ID:", productId);
         }
        setReviews(productData.reviews || []);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };
    const role = productService.getUserRole();
    setIsAdmin(role === "admin");   //疑惑
    fetchProduct();
  }, [productId]);


  // new
useEffect(() => {
  // 确保只有在 product 已经加载并且用户对象也存在时才执行检查
  if (!product || !user) {
    return;
  }

  // 检查用户是否已购买过该商品
  const checkIfPurchased = async () => {

    try {
      const orders = await orderService.getAllOrders(); // 获取用户所有订单
      // console.log("orders:", orders);

      const hasPurchasedProduct = orders.some((order) => {
        // 假设订单中的商品信息存储在 orderItems_id 中
        return order.orderItems_id.some((item) => item._id === productId);
      });

      setHasPurchased(hasPurchasedProduct);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
    }
  };

  checkIfPurchased();
}, [productId, user, product]); 

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

  const handleEdit = async () => {
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

//reviews
useEffect(() => {
  const fetchUserId = () => {
    try {
      const userId = productService.getUserId(); // 从 productService 获取用户 ID
      setUserId(userId);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  fetchUserId();
}, []);

useEffect(() => {
  const fetchProductDetails = async () => {
    try {
      // 获取商品信息
      const productData = await productService.showProduct(productId);
      setProduct(productData);

      // 获取商品评论
      const reviewsData = await productService.showReview(productId);
      setReviews(reviewsData);

      // 检查用户是否购买过该商品
      const purchased = await checkIfPurchased(productId, userId);
      setHasPurchased(purchased);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchProductDetails();
  }
}, [productId, userId]);
// const checkIfPurchased = async (productId, userId) => {
//   // 假设实现一个后端接口来验证用户是否购买过该商品
//   return true; // 假设已经购买，返回 true
// };

  // useEffect(() => {
  //   const fetchReview = async (productId) => {
  //     try {
  //       console.log("Fetching reviews for product ID:", productId);
  //       const reviews = await productService.showReview(productId);
  //       setReviews(reviews);
  //     } catch (error) {}
  //   };
  //   fetchReview(productId);
  // }, []);

  const handleAddReview = async (reviewFormData) => {
    const newReview = await productService.createReview(
      productId,
      reviewFormData
    );
     setReviews((prevReviews) => [...prevReviews, newReview]); 
    setReviewFormVisible(false); 
    // setProduct({ ...product, reviews: [...product.reviews, newReview] });
  };
  //  if (loading) return <div>Loading...</div>;
   if (!product) return <div>Product not found</div>;
  //  const handleCreateReview = async () => {
  //    try {
  //      const reviewFormData = {
  //        user_id,
  //        product_id: item.product._id,
  //        text: "",
  //      };
  //      console.log("Review data to send:", reviewFormData);
  //      const response = await productService.createReview(reviewFormData);
  //      console.log("Review created successfully:", response);
  //    } catch (error) {
  //      console.error("Error creating Review:", error.message);
  //    }
  //  };

  // const handleDeleteReview = async(reviewId)=>{
  //   const deleteReview = await productService.deleteReview(productId,reviewId)
  //   setProduct({
  //     ...product,
  //     reviews:product.reviews.filter((review)=>review._id !== reviewId)
  //   });
  // };

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
        {/* admin can edit and delete product */}
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
        {reviews.map((review) => {
          console.log("review:",review);
          return (
        <article key={review._id}>
        <h3>{review.username}</h3>
         <p>{review.text}</p>
    </article>
  );
})}
      </div>
    </>
  );
};

export default ProductDetail;
