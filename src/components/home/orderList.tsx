// components/home/OrdersList.tsx

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { order, order_history } from "../../services/home/order";

const OrdersList: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppContext must be used within an AppProvider");

  const { token } = appContext;
  const [orders, setOrders] = useState<order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await order_history(token);
        if ("error" in response) {
          setOrders([]);
        } else {
          setOrders(response);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-500 text-sm">You have no orders yet.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border shadow-md p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize
    ${
      order.status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : order.status === "shipped"
        ? "bg-blue-100 text-blue-800"
        : order.status === "delivered"
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
    }`}
            >
              {order.status}
            </span>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Delivery Address:</strong> {order.adress_delivery}
            </p>
            <p>
              <strong>Total:</strong> {order.total} DA
            </p>
            <p>
              <strong>Ordered On:</strong> {new Date(order.created_at!).toLocaleString()}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between border-b pb-2 text-gray-700">
                  <span>
                    {item.product.name} × {item.qte}
                  </span>
                  <span>{item.price} DA</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
