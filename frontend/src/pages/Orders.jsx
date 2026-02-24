import React, { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await apiRequest({ method: "get", endpoint: "/api/orders" });
      if (data && (data.orders || Array.isArray(data))) {
        setOrders(data.orders || data);
        setError(null);
      } else {
        setError("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user}</td>
                <td>{order.totalAmount}</td>
                <td>{order.orderStatus}</td>
                <td>{order.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
