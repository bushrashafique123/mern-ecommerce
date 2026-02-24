import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/services/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest({
        method: "get",
        endpoint: `/api/categories?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&order=${order}`,
      });

      if (response && response.categories) {
        setCategories(response.categories || []);
        setTotal(response.total || 0);
        setTotalPages(response.totalPages || 1);
      } else {
        setCategories([]);
        setTotal(0);
        setTotalPages(1);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
      setTotal(0);
      setTotalPages(1);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false); // always stop loading
    }
  }, [page, search, sortBy, order, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
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
    refetch: fetchCategories,
  };
}