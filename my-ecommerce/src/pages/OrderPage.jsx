import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchCarts } from "@/slices/cartSlice";
import { loadStripe } from "@stripe/stripe-js";

export default function OrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], status } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCarts());
    }
  }, [dispatch, status]);

  const orderItems = (cartItems || []).map((item) => ({
    productId: item._id,
    name: item.productId?.title || item.name,
    price: item.productId?.price || item.price || 0,
    quantity: item.quantity ?? item.qty ?? 1,
    image: item.productId?.image,
  }));
  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalQuantity = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    try {
      if (orderItems.length === 0) {
        setError("Your cart is empty. Add items before proceeding.");
        return;
      }

      setLoading(true);
      setError(null);

      const { data: order } = await axios.post(
        "/api/orders",
        { items: orderItems },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!order || !order._id) {
        throw new Error("Failed to create order");
      }
      const { data: session } = await axios.post(
        "/api/orders/checkout",
        { orderId: order._id }
      );

      if (!session || !session.id) {
        throw new Error("Failed to create Stripe session");
      }
      setOrderPlaced(true);
      window.location.href = `https://checkout.stripe.com/pay/${session.id}`;

    } catch (err) {
      console.error("Order Error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to place order. Please try again."
      );
      setLoading(false);
    }
  };

  if (status === "loading" && cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Loading order details...</p>
          <div className="animate-spin inline-block">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📦 Order Summary</h1>
        <button
          onClick={() => navigate("/cart")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Cart
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-semibold">⚠️ Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}
      {orderItems.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border">
          <p className="text-xl text-gray-500 mb-4">🛒 Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📋 Order Items ({totalQuantity})</h2>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start border-b pb-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 min-w-20 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">💰 Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹0</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>📍 Delivery:</strong> Will be delivered to your registered address within 3-5 business days
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || orderPlaced}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
              loading || orderPlaced
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Processing Payment...
              </>
            ) : orderPlaced ? (
              <>
                <span>✅</span>
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <span>💳</span>
                Proceed to Secure Checkout
              </>
            )}
          </button>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>🔒 Secured by Stripe | No payment info stored on our server</p>
          </div>
        </>
      )}
    </div>
  );
}