import React, { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiRequest({
        method: "get",
        endpoint: "/api/orders",
      });

      if (!data || (!data.orders && !Array.isArray(data))) {
        setOrders([]);
        return;
      }

      setOrders(data.orders || data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setActionLoading(true);
      await apiRequest({
        method: "put",
        endpoint: `/api/orders/${orderId}`,
        data: { orderStatus: status },
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: status } : o
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: status });
      }
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      setActionLoading(true);
      await apiRequest({
        method: "delete",
        endpoint: `/api/orders/${orderId}`,
      });

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const retryPayment = async (orderId) => {
    try {
      setActionLoading(true);
      const res = await apiRequest({
        method: "post",
        endpoint: "/api/orders/checkout",
        data: { orderId },
      });

      if (res?.id) {
        window.location.href = `https://checkout.stripe.com/pay/${res.id}`;
      }
    } catch (err) {
      console.error("Stripe session failed:", err);
      alert("Stripe session failed");
    } finally {
      setActionLoading(false);
    }
  };


  if (loading)
    return <div style={{ padding: 20 }}>Loading orders...</div>;

  if (error)
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => setRefresh((p) => !p)}>Retry</button>
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div style={{ padding: 20 }}>
        <h3>No Orders Found</h3>
        <p>There is nothing to show right now.</p>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders</h2>

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Stripe</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              style={{ cursor: "pointer" }}
            >
              <td>{order._id?.slice(-6)}</td>

              <td>
                {order.user
                  ? `${order.user.name} (${order.user.email})`
                  : "N/A"}
              </td>

              <td>${order.totalAmount?.toFixed(2)}</td>

              <td>{order.orderStatus}</td>

              <td>{order.paymentStatus}</td>

              <td>
                {order.paymentStatus === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      retryPayment(order._id);
                    }}
                    disabled={actionLoading}
                  >
                    Retry Payment
                  </button>
                )}
              </td>

              <td>
                <select
                  value={order.orderStatus}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  disabled={actionLoading}
                >
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order._id);
                  }}
                  disabled={actionLoading}
                  style={{ marginLeft: 10, color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 20,
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: 10,
            }}
          >
            <h3>Order Details</h3>

            <p><b>ID:</b> {selectedOrder._id}</p>

            <p>
              <b>User:</b>{" "}
              {selectedOrder.user
                ? `${selectedOrder.user.name} (${selectedOrder.user.email})`
                : "N/A"}
            </p>

            <p><b>Status:</b> {selectedOrder.orderStatus}</p>
            <p><b>Payment:</b> {selectedOrder.paymentStatus}</p>

            <p><b>Total:</b> ${selectedOrder.totalAmount?.toFixed(2)}</p>

            <p>
              <b>Date:</b>{" "}
              {selectedOrder.createdAt
                ? new Date(selectedOrder.createdAt).toLocaleString()
                : "N/A"}
            </p>

            <h4>Items</h4>

            {selectedOrder.items?.length ? (
              <table border="1" width="100%" cellPadding="6">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items</p>
            )}

            <div style={{ marginTop: 20 }}>
              <b>Update Status:</b>

              <select
                value={selectedOrder.orderStatus}
                onChange={(e) =>
                  updateStatus(selectedOrder._id, e.target.value)
                }
                disabled={actionLoading}
                style={{ marginLeft: 10 }}
              >
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ marginTop: 20 }}>
              {selectedOrder.paymentStatus === "pending" && (
                <button
                  onClick={() => retryPayment(selectedOrder._id)}
                  disabled={actionLoading}
                >
                  Retry Stripe Payment
                </button>
              )}

              <button
                onClick={() => deleteOrder(selectedOrder._id)}
                style={{ marginLeft: 10, color: "red" }}
                disabled={actionLoading}
              >
                Delete Order
              </button>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{ marginTop: 20 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;