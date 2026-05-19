import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("localstore_user") || "null"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("localstore_token");
    if (!token) return;
    api.get("/auth/me").then(({ data }) => setUser(data.user)).catch(() => logout());
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("localstore_token", data.token);
      localStorage.setItem("localstore_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("localstore_token", data.token);
      localStorage.setItem("localstore_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("localstore_token");
    localStorage.removeItem("localstore_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthed: Boolean(user) }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
