import { useContext } from "react";
import { AuthedUserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import * as orderService from "../../services/orderService";
const ShoppingCart = () => {
  const navigate = useNavigate();
  const { user, cart, removeFromCart, clearCart } =
    useContext(AuthedUserContext);
  if (!user) {
    console.error("User not logged in.");
    navigate("/signin");
    return null;
  }
  console.log("cart",cart)

  const user_id = user._id;

  const handleCheckout = async () => {
    if (!user || !user._id) {
      console.error("User not loaded or user_id missing.");
      return;
    }

    try {
      const orderFormData = {
        user_id: user._id,
        orderItems: cart.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity,
          purchasePrice: item.product.price,
        })),
      };
      console.log("Cart before checkout:", cart);
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

  if (cart.length === 0) {
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
          <li key={item.product_id}>
            <h3>{item.product.name}</h3>
            <p>Price:${item.product.price}</p>
            <p>Quantity:{item.quantity}</p>
            <p>Total:${item.product.price * item.quantity}</p>
            <button
              onClick={() => {
                console.log("Removing product with id:", item.product._id);
                removeFromCart(item.product._id);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotal()}</h3>
      <button onClick={handleCheckout}>Checkout all items</button>
    </div>
  );
};

export default ShoppingCart;
