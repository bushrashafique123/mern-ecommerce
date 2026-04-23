import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { deleteCategoryById } from "@/utils/deleteCategory"

export default function DeleteDialog({ isOpen, onClose, categoryId, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState(null) 

  useEffect(() => {
    if (!isOpen) {
      setError("")
    }
  }, [isOpen])

  const handleConfirm = async () => {
    if (!categoryId) {
      setError("Invalid category id")
      setToast({ message: "Invalid category id", variant: "error" })
      return
    }
    setLoading(true)
    setError("")
    try {
      await deleteCategoryById(categoryId)
      setToast({ message: "Category deleted", variant: "success" })
      onDeleted?.()
      // auto close after short delay so user can see toast
      setTimeout(() => {
        setLoading(false)
        onClose?.()
      }, 800)
    } catch (err) {
      const msg = err?.message ?? "Delete failed"
      setError(msg)
      setToast({ message: msg, variant: "error" })
      setLoading(false)
    }
  }

  // simple auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  if (!isOpen) return null

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-lg ring-1 ring-ring">
          <h3 className="text-lg font-semibold">Delete category</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>

          {error && (
            <div className="mt-3 rounded-md bg-red-900/30 p-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {/* inline toast */}
      {toast && (
        <div
          className={`fixed right-4 bottom-6 z-60 w-auto rounded-md px-4 py-2 text-sm font-medium shadow-lg transition ${
            toast.variant === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </>
  )
}
