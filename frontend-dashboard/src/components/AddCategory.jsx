import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from "@/services/api";

export default function AddCategory({ onAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);

    const response = await apiRequest({
      method: "post",
      endpoint: "/api/categories",
      data: {
        name: name.trim(),
        description: description.trim(),
      },
      successMessage: "Category added successfully!",
      useToken: true,
    });

    setLoading(false);

    if (response) {
      setName("");
      setDescription("");
      onAdded?.(); // refresh categories list
    } else {
      setError("Failed to add category");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          {loading ? "Adding..." : "Add Category"}
        </Button>
      </DialogFooter>
    </form>
  );
}
