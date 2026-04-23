import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getProductsByCategory } from "@/api/productApi"
import { useDispatch } from "react-redux"
import { addItemToCart } from "@/slices/cartSlice"


const CategoryProducts = () => {
  const { name } = useParams()
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await getProductsByCategory(name)
        setProducts(data.products || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (name) fetchProducts()
  }, [name])



const handleAddToCart = (id) => {
  dispatch(addItemToCart({ productId: id, quantity: 1 }))
}
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center capitalize">
        {name} Products
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
      
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              <h2 className="font-semibold text-lg">
                {p.title}
              </h2>

              <p className="text-gray-500 text-sm">
                {name}
              </p>

              <p className="text-green-600 font-bold text-lg">
                Rs {p.price}
              </p>

              <button   onClick={() => handleAddToCart(p._id)} className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>

    </div>
  )
}

export default CategoryProducts