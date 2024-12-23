import React, { useEffect, useState } from "react";
import * as orderService from "../../services/orderService";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("Fetching orders...");
      try {
        const ordersData = await orderService.getAllOrders();
         console.log("ordersData:", ordersData);
        if (ordersData.length === 0) {
          setOrders([]);
        } else {
          setOrders(ordersData);
        }
      } catch (error) {
        setError("Failed to load orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

 


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div>
          <p>
            You don't have any orders yet. Would you like to go to the shopping
            page?
          </p>
          <button onClick={() => navigate("/products")}>Go to Shop</button>
        </div>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>

              <div>
                {order.orderItems_id.map((item) => {
                  // 订单项已经包含了详细信息
                  return (
                    <div key={item._id}>
                      <h4>{item.product_id.name}</h4>
                      <h4>{item.product_id.image_url}</h4>
                      <p>Price: ${item.purchasePrice}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Total: ${item.purchasePrice * item.quantity}</p>
                    </div>
                  );
                })}
              </div>

              <h4>
                Total Paid: $
                {order.orderItems_id
                  .reduce(
                    (total, item) => total + item.purchasePrice * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </h4>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
