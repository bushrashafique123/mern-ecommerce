import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiRequest } from "@/services/api";

export default function DeleteProductDialog({
  isOpen,
  onClose,
  productId,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmDelete = async () => {
    if (!productId) {
      setError("Invalid product ID");
      return;
    }

    setDeleting(true);
    setError("");

    const response = await apiRequest({
      method: "delete",
      endpoint: `/api/products/${productId}`,
      useToken: true,
      successMessage: "Product deleted successfully!",
    });

    setDeleting(false);

    if (response) {
      onDeleted?.();
      onClose?.();
    }
   
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full rounded-lg bg-card p-6 shadow-lg">
        <h3 className="text-lg font-semibold">Delete product</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium">this product</span>? This action cannot be undone.
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
