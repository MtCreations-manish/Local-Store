import { motion } from "framer-motion";
import { ArrowRight, LayoutTemplate, Package, Store } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  ["Store builder", "Create shopping or grocery storefronts with themes and public URLs.", Store],
  ["Product catalog", "Manage products, images, pricing, inventory, search, filters, and featured items.", Package],
  ["Theme engine", "Render responsive React themes from one store data contract.", LayoutTemplate]
];

export default function Home() {
  return (
    <main>
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-wide text-brand">Multi-vendor local commerce</p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">LocalStore Platform</h1>
            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">Launch public store pages for local shopping and grocery sellers with JWT auth, Cloudinary uploads, MySQL data, and a flexible theme system.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/register">Create your store <ArrowRight size={18} /></Link>
              <Link className="btn btn-ghost" to="/store/urban-daily-store">View demo store</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-lg bg-slate-100 shadow-soft dark:bg-slate-900">
            <img src="https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1300&q=80" alt="Local ecommerce store counter" className="h-full min-h-[360px] w-full object-cover" />
          </motion.div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {features.map(([title, text, Icon]) => (
          <article key={title} className="rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
            <Icon className="mb-4 text-brand" />
            <h2 className="text-lg font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
