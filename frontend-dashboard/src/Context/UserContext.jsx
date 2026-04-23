// UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
async function fetchUser() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const res = await apiRequest({
      method: "get",
      endpoint: "/auth/users/me",
      useToken: true,
    });

    setUser(res || null);
  } catch (error) {
    console.log(error);
    setUser(null);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);