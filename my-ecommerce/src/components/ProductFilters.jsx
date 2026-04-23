import { useDispatch, useSelector } from "react-redux";
import { setSearch,setSort } from "@/slices/productSlice";

const ProductFilters = () => {
  const dispatch = useDispatch();
  const { search, sortBy, order } = useSelector(state => state.products);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className="border p-2 rounded w-full md:w-1/3"
      />
      <select
        value={sortBy}
        onChange={(e) =>
          dispatch(setSort({ sortBy: e.target.value, order }))
        }
        className="border p-2 rounded"
      >
        <option value="createdAt">Newest</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
      <select
        value={order}
        onChange={(e) =>
          dispatch(setSort({ sortBy, order: e.target.value }))
        }
        className="border p-2 rounded"
      >
        <option value="asc">Low → High</option>
        <option value="desc">High → Low</option>
      </select>

    </div>
  );
};

export default ProductFilters;