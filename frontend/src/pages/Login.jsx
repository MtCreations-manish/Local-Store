import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(event) {
    event.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <main className="mx-auto grid min-h-[78vh] max-w-md place-items-center px-4">
      <form onSubmit={submit} className="w-full space-y-4 rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-black">Login</h1>
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <div className="flex justify-between text-sm text-slate-500">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </main>
  );
}
