import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import {Table,TableBody,TableCell,TableFooter,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteDialog from "@/components/DeleteDialog";
import UpdateCategoryForm from "@/components/UpdateCategoryForm";
import AddCategory from "@/components/AddCategory";

import BoxLoader from "@/utils/BoxLoader";
import { useCategories } from "@/hooks/useCategories";

export function Categories() {

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
const {
  categories,
  loading,
  error,
  page,
  setPage,
  totalPages,
  total,
  search,
  setSearch,
  order,
  setOrder,
  refetch,
} = useCategories();
 
 

  

  return (
    
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <AddCategory onAdded={refetch} />
          </DialogContent>
        </Dialog>
      </div>
       <div className="flex justify-between items-center mb-4">
  <input
    type="text"
    placeholder="Search categories..."
    className="border px-3 py-2 rounded-md text-sm w-64"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
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
          <CardTitle className="text-base">
            All Categories ({total})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <BoxLoader message="Loading categories..." />
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : total === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell className="font-medium">
                      {cat.name}
                    </TableCell>
                    <TableCell>{cat.description || "-"}</TableCell>
                    <TableCell>
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedCategory(cat._id);
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
                  <TableCell colSpan={4} className="text-sm text-muted-foreground">
                    Total categories: {total}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            
          )}
  
        </CardContent>
      </Card>
        <div className="flex justify-between items-center mt-4">
  <Button
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Previous
  </Button>

  <span className="text-sm">
    Page {page} of {totalPages}
  </span>

  <Button
    disabled={page === totalPages}
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </Button>
</div>
      {/* DELETE */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        categoryId={selectedCategory}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={refetch}
      />

      {/* EDIT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <UpdateCategoryForm
              category={selectedCategory}
              onUpdated={() => {
                setIsEditOpen(false);
                setSelectedCategory(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
