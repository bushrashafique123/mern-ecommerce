import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/slices/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();


  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
    const res = await API.get(`/api/products/${id}`);
setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
const handleAddToCart = () => {
  dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
};
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full p-6 grid md:grid-cols-2 gap-8">
      
        <div className="overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[400px] object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="flex flex-col justify-between space-y-5">
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              Category: {product.category}
            </p>

            <p className="text-yellow-500 text-lg font-semibold">
              ⭐ {product.rating} Rating
            </p>

            <p className="text-gray-600 mt-4">
              {product.description || "No description available"}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-yellow-600">
              ₹{product.price}
            </p>

            <Button onClick={handleAddToCart} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-2 text-lg py-3 rounded-xl shadow-md">
              <ShoppingCart size={20} /> Add to Cart
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;