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
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* 订单为空的提示 */}
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You don't have any orders yet. Would you like to go to the shopping
            page?
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-lime-600 text-white px-6 py-2 rounded-md hover:bg-lime-500 transition duration-300"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        // 订单列表
        <ul className="space-y-8">
          {orders.map((order) => (
            <li
              key={order._id}
              className="border-b pb-8 last:border-b-0 hover:shadow-xl transition duration-300"
            >
              {/* 订单ID和状态 */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-sm text-gray-500">Status: {order.status}</p>
                <p className="text-sm text-gray-500">
                  Created At: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* 订单项 */}
              <div className="space-y-6">
                {order.orderItems_id.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-[#fafaf6] border rounded-lg shadow-sm hover:bg-gray-50 transition duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product_id.image_url}
                        alt={item.product_id.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {item.product_id.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Price: ${item.purchasePrice}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 mt-2">
                      Total: ${item.purchasePrice * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* 总支付金额 */}
              <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-bold text-gray-900">
                  Total Paid: $
                  {order.orderItems_id
                    .reduce(
                      (total, item) =>
                        total + item.purchasePrice * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </h4>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
