import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/slices/productSlice";
import ProductCom from "./ProductCom";
import ProductFilters from "@/components/ProductFilters";
import { setPage } from "@/slices/productSlice";

const ProductsPage = () => {
  const dispatch = useDispatch();

  const { products, loading, page, totalPages, search, sortBy, order } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, search, totalPages, sortBy, order]);

  return (
    <>
      <div className="p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products && products.length > 0 ? (
              products.map((p) => (
                <ProductCom key={p._id} product={p} />

              ))
            ) : (
              <p>No products </p>
            )}
          </div>
        )}

      </div>

      <div className="flex justify-center items-center gap-2 mt-8">


        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-yellow-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => dispatch(setPage(i + 1))}
            className={`px-4 py-2 rounded ${page === i + 1 ? "bg-yellow-200 text-black" : "bg-yellow-400"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-yellow-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </>
  );
};

export default ProductsPage;