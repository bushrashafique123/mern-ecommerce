import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/services/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

 const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const response = await apiRequest({
      method: "get",
      endpoint: `/api/products?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&order=${order}`,
    });
    if (response) {
      setProducts(response.products || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } else {
      setProducts([]);
      setError("Invalid response from server.");
    }
  } catch (err) {
    console.error(err);
    setError("Failed to fetch products.");
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, [page, limit, search, sortBy, order]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
    sortBy,
    setSortBy,
    order,
    setOrder,
    refetch: fetchProducts,
  };
}