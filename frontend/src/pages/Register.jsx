import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function submit(event) {
    event.preventDefault();
    try {
      await register(form);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <main className="mx-auto grid min-h-[78vh] max-w-md place-items-center px-4">
      <form onSubmit={submit} className="w-full space-y-4 rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-black">Create account</h1>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password, minimum 8 characters" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        <p className="text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-brand">Login</Link></p>
      </form>
    </main>
  );
}
