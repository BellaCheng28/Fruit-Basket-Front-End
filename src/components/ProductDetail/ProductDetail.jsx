import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as productService from "../../services/productService";
import { AuthedUserContext } from "../../App";
import ReviewForm from "../ReviewForm/ReviewForm";
import * as orderService from "../../services/orderService";
const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // get URL productId
  const { user, addToCart } = useContext(AuthedUserContext);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [salesCount, setSalesCount] = useState(0);
  const reviewsRef = useRef(null);

  useEffect(() => {
    fetchProductDetails();
  }, []);
  const fetchProductDetails = async () => {
    try {
      const productData = await productService.showProduct(productId);
      setProduct(productData);

      const reviewsData = await productService.showReview(productId);
      const reviewsWithUsernames = await Promise.all(
        reviewsData.map(async (review) => {
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

      //检查用户是否购买过该商品
      const orders = await orderService.getAllOrders();
      const purchased = orders.some((order) =>
        order.orderItems_id.some((item) => item.product_id._id === productId)
      );

      setHasPurchased(purchased);

      const totalSales = orders
        .flatMap((order) => order.orderItems_id)
        .filter((item) => item.product_id._id === productId)
        .reduce((total, item) => total + item.quantity, 0);
      setSalesCount(totalSales);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productService.deleteProduct(productId), // 删除商品
      alert("Product deleted successfully.");
      navigate("/products");
      return;
    } catch (error) {
      alert("Failed to delete product.");
      console.error("Error deleting product:", error.message);
    }
  };
  const handleEdit = () => {
    navigate(`/products/${productId}/edit`, { state: { product } });
  };
  const handleAddToCart = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (quantity === 0) {
      alert("Please select a quantity greater than 0.");
      return;
    }
    addToCart(product, quantity);
    alert(`${quantity} of ${product.name} added to cart!`);
  };
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddReview = async (reviewFormData) => {
    try {
      const reviewData = {
        text: reviewFormData.text,
        user_id: user._id,
        username: user.username,
        product_id: productId,
      };
      const newReview = await productService.createReview(reviewData);
      setReviews((PrevReviews) => [...PrevReviews, newReview]);
      setReviewFormVisible(false);
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-col justify-start items-center min-h-screen w-full bg-gray-100">
        <div className="flex flex-wrap justify-start flex-row  bg-white mt-4 rounded-lg shadow-md   w-11/12 lg:w-10/12 xl:w-8/12">
          {/* img */}
          <div className="flex-grow w-full lg:w-1/2">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full  object-cover rounded-md "
            />
          </div>

          <div className="bg-[#fafaf6] flex flex-col justify-evenly   rounded-lg shadow-md  p-6  flex-grow w-full lg:w-1/2">
            <div className="flex flex-wrap mt-4">
              <div className="flex-1">
                <h1 className="text-xl w-full font-bold text-gray-800">
                  {product.name}
                </h1>

                <p
                  className="text-blue-500 cursor-pointer"
                  onClick={scrollToReviews}
                >
                  Reviews({reviews.length})
                </p>
                <p className="text-gray-500">Saled {salesCount} items</p>
                {/* price */}
                <div>
                  <p className="text-md font-bold text-lime-600 mt-4">
                    $ {product.price} / lb
                  </p>
                </div>
                {/* Quantity Control */}
                <div className="inline-flex items-center gap-3 mt-4  px-4 py-1 texl-lg bg-gray-200 rounded-full hover:bg-gray-300 transition ">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button onClick={() => setQuantity((prev) => prev + 1)}>
                    +
                  </button>
                </div>

                <div className="mt-2 text-red-600 font-bold">
                  <p>Totoal:$ {(product.price * quantity).toFixed(2)}</p>
                </div>
              </div>

              {/* product description */}
              <div className="flex-1">
                <div className="text-gray-400 font-serif w-full mt-2 leading-relaxed ">
                  <p className="text-gray-700 ">Description</p>
                  {product.description}
                </div>
              </div>
            </div>
            {/* all buttons */}

            <div>
              {/* Add to Cart Button */}
              <div className="flex justify-center mt-4 w-full">
                <button
                  onClick={handleAddToCart}
                  className=" p-3 bg-lime-600 text-white py-2 rounded-md hover:bg-lime-500 transition "
                >
                  Add to cart
                </button>
              </div>

              {/* Admin Buttons */}
              {user?.role === "admin" && (
                <div className="flex gap-3 mt-4 justify-center w-full">
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
          </div>
        </div>

        {/* Reviews */}
        <div
          ref={reviewsRef}
          className=" flex items-start mt-4 flex-col  p-6 bg-[#fafaf6] rounded-lg shadow-md w-11/12 lg:w-10/12 xl:w-8/12 "
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Reviews List
          </h2>

          {/* Write a Review Button */}
          {hasPurchased && (
            <button
              onClick={() => setReviewFormVisible(true)}
              className="bg-lime-600  text-white px-6 py-2 rounded-md hover:g-lime-500  transition"
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
          {reviews.map((review) => {
            const formatDate = (isoDate) => {
              const date = new Date(isoDate); // 创建 Date 对象
              const options = {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
                weekday: "short", // 星期简写
              };
              const formattedDate = new Intl.DateTimeFormat(
                "en-US",
                options
              ).format(date);
              return formattedDate;
            };
            return (
              <article key={review._id} className="w-full">
                <div className="border-t-2 mt-4 w-full  ">
                  <h3 className="text-xl text-gray-800">{review.username}</h3>
                  <p className="text-gray-600 ">{review.text}</p>
                  <p className="text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default ProductDetail;
