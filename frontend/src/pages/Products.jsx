import { useState } from "react";
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// Stripe integration can be added here for checkout/payment flows
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProductDialog from "@/components/DeleteProductDialog";
import UpdateProductForm from "@/components/UpdateProductForm";
import AddProduct from "@/components/AddProduct";
import BoxLoader from "@/utils/BoxLoader";
import { useProducts } from "@/hooks/useProducts";

export function Products() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
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
    refetch,
  } = useProducts();

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage store products</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <AddProduct onAdded={refetch} />
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH & SORT */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-3 py-2 rounded-md text-sm w-64"
          value={search}
          onChange={(e) => {
            setPage(1); // reset page
            setSearch(e.target.value);
          }}
        />
        <select
          className="border px-3 py-2 rounded-md text-sm"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Products ({total})</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <BoxLoader message="Loading products..." />
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : total === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product, idx) => (
                    <TableRow
                      key={product._id}
                      className={`transition-all hover:bg-accent/40 ${idx % 2 === 0 ? "bg-muted/40" : ""}`}
                    >
                      <TableCell>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-14 h-14 object-cover rounded-md border shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center bg-muted rounded-md border text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.categoryId?.name || "-"}</TableCell>
                      <TableCell>₹ {product.price}</TableCell>
                      <TableCell>{product.rating || "-"}</TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedProduct(product._id);
                            setIsDeleteOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7} className="text-sm text-muted-foreground">
                      Total products: {total}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}

        </CardContent>
      </Card>
{/* PAGINATION */}
<div className="flex justify-between items-center mt-4">
  <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
    Previous
  </Button>
  <span className="text-sm">
    Page {page} of {totalPages}
  </span>
  <Button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
    Next
  </Button>
</div>
      {/* DELETE */}
      <DeleteProductDialog
        isOpen={isDeleteOpen}
        productId={selectedProduct}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={refetch}
      />

      {/* EDIT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <UpdateProductForm
              product={selectedProduct}
              onUpdated={() => {
                setIsEditOpen(false);
                setSelectedProduct(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}