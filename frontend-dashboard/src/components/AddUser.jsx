import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from "@/services/api";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const response = await apiRequest({
      method: "post",
      endpoint: "/auth/users/register",
      data: { name, email, password, confirmPassword, phone, address, role },
      successMessage: "User created successfully!",
      useToken: true,
    });

    setLoading(false);

    if (response) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setAddress("");
      setRole("user");
      onAdded?.();
    }
    // API layer shows error toast when needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input placeholder="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border px-3 py-2">
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="ghost" disabled={loading}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create User"}</Button>
      </DialogFooter>
    </form>
  );
}
