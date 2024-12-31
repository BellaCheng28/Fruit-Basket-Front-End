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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl font-semibold text-gray-800 mb-6">Order Detail</h1>
  
  {cartItems.length > 0 ? (
    <ul className="space-y-6">
      {cartItems.map((item, index) => (
        <li
          key={index}
          className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">{item.product.name}</span>
            <span className="text-sm text-gray-500">x{item.quantity}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-600">Price: ${item.product.price}</span>
            <span className="font-semibold text-gray-900">
              Paid: ${item.product.price * item.quantity}
            </span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center text-gray-600 mt-4">Your cart is empty. No need to pay.</p>
  )}
  
  <div className="mt-6 border-t pt-4">
    <h3 className="text-2xl font-bold text-gray-900">
      Total Paid: ${calculateTotal()}
    </h3>
  </div>
</div>

  );
};


export default Orders;
