import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,DialogClose,DialogFooter,} from "@/components/ui/dialog";
import {Table,TableBody,TableCell,TableFooter,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AddUser from "@/components/AddUser";
import BoxLoader from "@/utils/BoxLoader";
import { apiRequest } from "@/services/api";
import { useUsers } from "@/hooks/useUsers";

export default function UsersPage() {
  const {users,loading, error,page,setPage,totalPages,total,search,setSearch,order,setOrder,refetch,} = useUsers();

  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editRole, setEditRole] = useState("user");

  const openEdit = (u) => {
    setEditingUser(u);
    setEditName(u.name || "");
    setEditPhone(u.phone || "");
    setEditAddress(u.address || "");
    setEditRole(u.role || "user");
    setEditError("");
  };

  const closeEdit = () => setEditingUser(null);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditLoading(true);
    setEditError("");

    const response = await apiRequest({
      method: "put",
      endpoint: `/auth/users/${editingUser._id}`,
      data: { name: editName, phone: editPhone, address: editAddress, role: editRole },
      successMessage: "User updated",
      useToken: true,
    });

    setEditLoading(false);
    if (response) {
      closeEdit();
      refetch();
    } else {
      setEditError("Failed to update user");
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user ${u.name}?`)) return;
    const response = await apiRequest({
      method: "delete",
      endpoint: `/auth/users/${u._id}`,
      successMessage: "User deleted",
      useToken: true,
    });

    if (response) refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage application users</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
            </DialogHeader>
            <AddUser onAdded={refetch} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <BoxLoader message="Loading users..." />
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u._id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role || "user"}</TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(u)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5} className="text-sm text-muted-foreground">
                      Total users: {total}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                  <span>Page {page} of {totalPages}</span>
                  <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {editingUser && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) closeEdit(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit user</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="py-2 grid gap-4">
              <Input placeholder="Full name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <Input placeholder="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
              <Input placeholder="Address" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
              <div>
                <label className="block text-sm mb-1">Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full rounded-md border px-3 py-2">
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {editError && <p className="text-sm text-destructive">{editError}</p>}

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" disabled={editLoading} onClick={closeEdit}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}