import { useEffect, useState, useContext } from "react";
import { useParams,useNavigate } from "react-router-dom";
import * as productService from "../../services/productService"; 
import { AuthedUserContext } from "../../App"; 


const ProductDetail = () => {
    const navigate =useNavigate();
  const { productId } = useParams(); // get URL productId
  const { addToCart } = useContext(AuthedUserContext);
  const [product, setProduct] = useState(null);
  const user = useContext(AuthedUserContext); // get user
  const [isAdmin, setIsAdmin] = useState(false);
  const [quantity, setQuantity] = useState(0); 


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.showProduct(productId); // get product detail
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };
     const role =productService.getUserRole();
     setIsAdmin(role === "admin");
    fetchProduct();
  }, [productId]); 

  if (!product) return <div>Loading...</div>;
  
  const handleDelete = async()=>{
   if(!window.confirm("Are you sure you want to delete this product?")) return;
   try {
      await productService.deleteProduct(productId);
      alert("Product deleted successfully.");
      navigate("/products");
   } catch (error) {
     alert("Failed to delete product.");
      console.error("Error deleting product:", error.message); 
   }
  };
 
  const handleEdit = async()=>{
    navigate(`/products/${productId}/edit`,{state:{product}});
  }
  
const handleAddToCart =()=>{
if(quantity===0){
   alert("Please select a quantity greater than 0.");
   return;
}
 addToCart(product, quantity);
  alert(`${quantity} of ${product.name} added to cart!`);
  };



const handleAddReview = async(reviewFormData)=>{
 const newReview = await productService.createReview(productId, reviewFormData);
 setProduct({...product,reviews:[...product.reviews,newReview]});

};

const handleDeleteReview = async(reviewId)=>{
  const deleteReview = await productService.deleteReview(productId,reviewId)
  setProduct({
    ...product,
    reviews:product.reviews.filter((review)=>review._id !== reviewId)
  });
};



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
          

      </div>
    </>
  );
};

export default ProductDetail;
