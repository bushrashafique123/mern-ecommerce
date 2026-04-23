import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from "@/services/api";

export default function AddProduct({ onAdded }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [rating, setRating] = useState("");
    const [stock, setstock] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await apiRequest({
      method: "get",
      endpoint: "/api/categories",
      useToken: false,
    });

    if (response) {
    setCategories(response.categories || response);
    }
  };

  // Convert file to base64 for Cloudinary upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(reader.result);
        console.log(reader.result) // Store as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price || !categoryId) {
      setError("Title, price, and category are required");
      return;
    }

    setLoading(true);

    const response = await apiRequest({
      method: "post",
      endpoint: "/api/products",
      data: {
        title: title.trim(),
        price: parseFloat(price),
        categoryId,
        image: image.trim(),
        rating: rating ? parseFloat(rating) : 0,
        stock 
      },
      successMessage: "Product added successfully!",
      useToken: true,
    });

    setLoading(false);

    if (response) {
      setTitle("");
      setstock("")
      setPrice("");
      setCategoryId("");
      setImage("");
      setImagePreview("");
      setRating("");
      onAdded?.(); // refresh products list
    }
    // Error is already shown as toast notification by API layer
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <Input
          placeholder="Product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <Input
          placeholder="Price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={loading}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="space-y-2">
          <label className="text-sm font-medium">Product Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

   <Input
          placeholder="add stock"
          type="number"
          min="0"
          max="50"
          value={stock}
          onChange={(e) => setstock(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Rating (0-5)"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="ghost" disabled={loading}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </DialogFooter>
    </form>
  );
}
