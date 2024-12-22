import { useEffect, useState } from "react";

const Orders = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCartItems = JSON.parse(
      sessionStorage.getItem("cartItems") || "[]"
    );
    setCartItems(savedCartItems);
  }, []);
 const calculateTotal = () => {
  return cartItems
    .reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0)
    .toFixed(2);
};
  
 
  return (
    <div>
      <h1>Order Detail</h1>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.product.name} - ${item.product.price}*{item.quantity} Paid:$
              {item.product.price * item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty. No need to pay.</p>
      )}
      <h3>Total Paid: ${calculateTotal()}</h3>
    </div>
  );
};


export default Orders;
