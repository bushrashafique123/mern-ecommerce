import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/slices/cartSlice";



const ProductCom = ({ product }) => {
const navigate = useNavigate();
 const dispatch = useDispatch();

const handleAddToCart = (e) => {
    e.stopPropagation();
  dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
};
  if (!product) return null; 

  return (
    <>
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
 
       <Card
        className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)} 
      >
        <div className="overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-60 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <CardContent className="p-4 space-y-3">
          <Badge className="bg-yellow-500 text-white">{product.category}</Badge>
          <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
          <p className="text-yellow-600 font-bold text-lg">₹{product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <p className="text-sm text-gray-500">⭐ {product.rating}</p>
         <Button
  onClick={handleAddToCart}
  disabled={product.stock === 0}
  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2 disabled:bg-gray-400"
>
  <ShoppingCart size={18} /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
</Button>
          
        </CardContent>
      </Card>
    </motion.div>
    
    </>
  );
};

export default ProductCom;