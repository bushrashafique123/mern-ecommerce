import React, { useEffect, useState } from "react"
import { getCategory } from "../api/category"
import { useNavigate } from "react-router-dom"
const Categories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchCategories = async (pageNumber = page) => {
    setLoading(true)
    setError("")

    try {
      const data = await getCategory(pageNumber, 8)
      setCategories(data?.categories || [])
      setTotalPages(data?.totalPages || 1)
    } catch (err) {
      console.error(err)
      setError(
        err?.response?.data?.message || err?.message || "Unable to load categories."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(page)
  }, [page])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <p className="text-lg font-medium text-yellow-600">Loading categories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <p className="mb-4 text-red-600 font-medium">{error}</p>
        <button
          className="px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          onClick={() => fetchCategories(page)}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold text-yellow-600">
          Shop by Category
        </h2>

        <button
          className="text-yellow-600 font-medium hover:underline"
          onClick={() => setPage(1)}
        >
          See All
        </button>

      </div>

 
  <div className="grname grname-cols-2 md:grname-cols-4 gap-6">

        {categories.map((cat) => (
          <div
            key={cat._id}
                onClick={() => navigate(`/products/category/${cat.name}`)}
            className="border rounded-xl p-4 flex items-center gap-3 
            hover:shadow-lg transition cursor-pointer 
            bg-gradient-to-r from-yellow-50 to-yellow-100"
          >

            <div className="bg-yellow-500 text-white p-2 rounded-lg">
              🛍
            </div>

            <p className="font-medium text-gray-700">
              {cat.name}
            </p>

          </div>
        ))}

      </div>
      <div className="flex justify-center mt-10 gap-3">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-md hover:bg-yellow-100 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-md hover:bg-yellow-100 disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  )
}

export default Categories