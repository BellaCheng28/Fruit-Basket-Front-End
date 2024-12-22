import { useContext, useEffect } from "react";
import { AuthedUserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import * as orderService from "../../services/orderService";
const ShoppingCart =()=>{
    const navigate = useNavigate();
    const { user_id ,cart, removeFromCart, clearCart } = useContext(AuthedUserContext);
  console.log("user_id",user_id);
 
 const handleCheckout = async() => {
      console.log("Checkout button clicked");
    try {
        const orderFormData = {
           user_id,
           orderItems: cart.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
            purchasePrice: item.product.price,
          })),
        };
     console.log("Order data to send:", orderFormData);
        const response = await orderService.createOrder(orderFormData);
        console.log("Order created successfully:", response);

          alert("Thank you for your purchase");
          clearCart();
          sessionStorage.setItem("cartItems", JSON.stringify(cart));
          navigate("/orders"); 
    } catch (error) {
       console.error("Error creating order:", error.message);
       alert("Failed to create order. Please try again."); 
    }
 
 };


     const calculateTotal = () => {
       return cart
         .reduce((total, item) => {
           return total + item.product.price * item.quantity;
         }, 0)
         .toFixed(2);
     };
    
    if(cart.length === 0){
        return (
          <div>
            Your cart is empty. <a href="/products">Go back to shopping</a>.
          </div>
        );
    
    }
    return (
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.product._id}>
              <h3>{item.product.name}</h3>
              <p>Price:${item.product.price}</p>
              <p>Quantity:{item.quantity}</p>
              <p>Total:${item.product.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.product._id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <h3>Total: ${calculateTotal()}</h3>
        <button onClick={handleCheckout}>Checkout all items</button>
      </div>
    );

}

export default ShoppingCart;