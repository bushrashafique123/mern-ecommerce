import { useDispatch, useSelector } from "react-redux";
import { fetchCarts, removeItemFromCart, updateCartItemQuantity, clearCart } from "@/slices/cartSlice";
import { useEffect } from "react";
import { createOrder, createCheckoutSession } from "@/slices/orderSlice";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, status, error } = useSelector((state) => state.cart);
  const isLoading = status === "loading";

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCarts());
    }
  }, [dispatch, status]);

  if (status === "idle" || (status === "loading" && cartItems.length === 0)) return <p>Loading...</p>;
  if (status === "failed" && cartItems.length === 0) return <p>Error loading cart: {error}</p>;
  const stripePromise = loadStripe("your_publishable_key_here");
  const handleOrderNow = async () => {
    try {
      const items = cartItems.map((item) => ({
        name: item.productId?.title,
        price: item.productId?.price,
        quantity: item.quantity,
      }));

      const orderRes = await dispatch(
        createOrder({ items })
      ).unwrap();


      const sessionRes = await dispatch(
        createCheckoutSession({ orderId: orderRes._id })
      ).unwrap();

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: sessionRes.id,
      });

    } catch (error) {
      console.log("Order Error:", error);
    }
  };
  const handleRemove = async (productId) => {
    try {
      await dispatch(removeItemFromCart(productId)).unwrap();
    } catch (error) {
      alert(`Failed to remove item: ${error}`);
    }
  };

  const handleQuantityChange = async (productId, qty, stock) => {
    if (qty < 1) return;

    if (qty > stock) {
      alert(`Only ${stock} items available`);
      return;
    }

    try {
      await dispatch(updateCartItemQuantity({ productId, quantity: qty })).unwrap();
    } catch (error) {
      alert(`Failed to update quantity: ${error}`);
    }
  };
  const totalPrice = cartItems.reduce(
  (acc, item) =>
    acc + item.quantity * item.productId?.price,
  0
);

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      alert(`Failed to clear cart: ${error}`);
    }
  };
  const hasOutOfStock = cartItems.some(
    item => item.productId?.stock === 0
  );

  return (
 <div className="max-w-5xl mx-auto p-6">
  <h2 className="text-3xl font-bold mb-6">🛒 My Cart</h2>

  {cartItems.length === 0 ? (
    <p className="text-xl text-gray-500 text-center">
      Your cart is empty 🛒
    </p>
  ) : (
    <>
      <div className="space-y-4">
        {cartItems.map((item) => {
          const product = item.productId;

          return (
            <div
              key={item._id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border"
            >
              {/* LEFT SIDE */}
              <div className="flex gap-4 items-center">
                <img
                  src={product?.image}
                  alt={product?.title}
                  className="w-24 h-24 object-cover rounded-md"
                />

                <div>
                  <h3 className="font-semibold text-lg">
                    {product?.title}
                  </h3>

                  <p className="text-gray-600">
                    ₹{product?.price}
                  </p>

                  {/* STOCK */}
                  {product?.stock === 0 ? (
                    <p className="text-red-500 text-sm">
                      Out of Stock
                    </p>
                  ) : (
                    <p className="text-green-600 text-sm">
                      In Stock ({product.stock})
                    </p>
                  )}

                  <div className="flex items-center mt-3 border rounded w-fit overflow-hidden">
             
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          item.quantity - 1,
                          product.stock
                        )
                      }
                      disabled={item.quantity <= 1 || isLoading}
                    >
                      −
                    </button>
                    <span className="px-4 font-medium">
                      {item.quantity}
                    </span>

                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          item.quantity + 1,
                          product.stock
                        )
                      }
                      disabled={
                        item.quantity >= product.stock ||
                        product.stock === 0 ||
                        isLoading
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-500 text-sm mt-2 hover:underline"
                    onClick={() => handleRemove(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-lg font-semibold">
                ₹{product?.price * item.quantity}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4">
       
<button onClick={() => navigate("/Orders")}>
  Order Now
</button>
        </h3>

        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span className="font-bold text-lg">
            ₹{totalPrice}
          </span>
        </div>

        <button
          className={`w-full mt-4 py-2 rounded text-white ${
            hasOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={hasOutOfStock}
          onClick={handleOrderNow}
        >
          {hasOutOfStock
            ? "Some items out of stock"
            : "Proceed to Checkout"}
        </button>

        <button
          className="w-full mt-3 text-red-500 text-sm"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>
    </>
  )}
</div>
  );
}

export default Cart;