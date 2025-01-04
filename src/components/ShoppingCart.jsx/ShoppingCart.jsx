import { useContext, useState } from "react";
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
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
        </svg>
        <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
        <p className="text-sm text-gray-500 mb-4">
          Don't worry, you can always find something you love!
        </p>
        <a
          href="/products"
          className="bg-lime-600 text-white px-6 py-3 rounded-md hover:bg-lime-500 transition duration-300"
        >
          Go back to shopping
        </a>
      </div>
    );
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6 mt-4  ">
      {/* Product orderList */}
      <div className="bg-[#fafaf6] rounded-lg">
        <ul className="space-y-4 ">
          {cart.map((item) => (
            <li key={item.product_id} className="border-b pb-4 last:border-b-0">
              <h3 className="text-xl font-semibold text-gray-800">
                {item.product.name}
              </h3>
              <p className="text-green-600">Price: ${item.product.price}</p>

              <p className="text-gray-600 bg-white w-20 rounded-md">
                Quantity: {item.quantity}
              </p>
              <p className="font-bold text-gray-900">
                Total: ${item.product.price * item.quantity}
              </p>
              <button
                onClick={() => {
                  console.log("Removing product with id:", item.product._id);
                  removeFromCart(item.product._id);
                }}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center ">
        <h3 className="text-lg font-semibold text-gray-900">
          Total: ${calculateTotal()}
        </h3>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 transition"
        >
          Checkout all items
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
