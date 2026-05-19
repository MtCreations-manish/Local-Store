import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api/client.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function submit(event) {
    event.preventDefault();
    const { data } = await api.post("/auth/forgot-password", { email });
    toast.success(data.message);
  }

  return (
    <main className="mx-auto grid min-h-[78vh] max-w-md place-items-center px-4">
      <form onSubmit={submit} className="w-full space-y-4 rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-black">Reset password</h1>
        <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-primary w-full">Send reset link</button>
      </form>
    </main>
  );
}
