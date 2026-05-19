import { BarChart3, Eye, LayoutDashboard, Palette, Plus, Settings, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/client.js";
import { Loader } from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const nav = [
  ["Overview", "", LayoutDashboard],
  ["Products", "products", ShoppingCart],
  ["Orders", "orders", BarChart3],
  ["Theme Settings", "themes", Palette],
  ["Store Settings", "settings", Settings],
  ["Analytics", "analytics", BarChart3]
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [activeStoreId, setActiveStoreId] = useState("");
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeStore = useMemo(() => stores.find((store) => store.id === Number(activeStoreId)) || stores[0], [stores, activeStoreId]);

  async function refresh() {
    setLoading(true);
    const [{ data: storeData }, { data: themeData }] = await Promise.all([api.get("/stores"), api.get("/themes")]);
    setStores(storeData.stores);
    setThemes(themeData.themes);
    setActiveStoreId((current) => current || storeData.stores[0]?.id || "");
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-lg bg-white p-4 shadow-soft dark:bg-slate-900">
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="font-bold">{user?.name}</p>
        </div>
        <nav className="grid gap-2 rounded-lg bg-white p-2 shadow-soft dark:bg-slate-900">
          {nav.map(([label, path, Icon]) => (
            <NavLink key={label} end={path === ""} to={path} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Routes>
          <Route path="/" element={<Overview stores={stores} activeStore={activeStore} setActiveStoreId={setActiveStoreId} themes={themes} refresh={refresh} />} />
          <Route path="/products" element={<Products activeStore={activeStore} />} />
          <Route path="/orders" element={<Placeholder title="Orders" text="Order capture can be connected to WhatsApp, Razorpay, or a checkout module later." />} />
          <Route path="/themes" element={<ThemeSettings store={activeStore} themes={themes} refresh={refresh} />} />
          <Route path="/settings" element={<StoreSettings store={activeStore} themes={themes} refresh={refresh} />} />
          <Route path="/analytics" element={<Placeholder title="Analytics" text="Track visits, product clicks, WhatsApp leads, and conversion sources here." />} />
        </Routes>
      </section>
    </main>
  );
}

function Overview({ stores, activeStore, setActiveStoreId, themes, refresh }) {
  if (!stores.length) return <CreateStore themes={themes} refresh={refresh} />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Dashboard</h1>
          <p className="text-sm text-slate-500">Manage stores, products, public themes, and settings.</p>
        </div>
        <select className="input max-w-xs" value={activeStore?.id || ""} onChange={(e) => setActiveStoreId(e.target.value)}>
          {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Store category" value={activeStore?.category} />
        <Stat label="Theme" value={activeStore?.Theme?.name || "Default"} />
        <Stat label="Public URL" value={`/store/${activeStore?.slug}`} />
      </div>
      <div className="rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">{activeStore.name}</h2>
            <p className="text-sm text-slate-500">{activeStore.description}</p>
          </div>
          <Link className="btn btn-primary" to={`/store/${activeStore.slug}`}><Eye size={17} /> Open public page</Link>
        </div>
      </div>
      <CreateStore themes={themes} refresh={refresh} compact />
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 truncate text-xl font-black capitalize">{value || "-"}</p></div>;
}

function CreateStore({ themes, refresh, compact = false }) {
  const [form, setForm] = useState({ name: "", description: "", category: "shopping", whatsappNumber: "", email: "", address: "", themeId: themes[0]?.id || "" });
  async function submit(event) {
    event.preventDefault();
    await api.post("/stores", form);
    toast.success("Store created");
    refresh();
  }
  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
      <h2 className="text-xl font-black">{compact ? "Create another store" : "Create your first store"}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" placeholder="Store name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="shopping">Shopping</option><option value="grocery">Grocery</option></select>
        <select className="input" value={form.themeId} onChange={(e) => setForm({ ...form, themeId: e.target.value })}>{themes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select>
        <input className="input" placeholder="WhatsApp number" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <textarea className="input min-h-24" placeholder="Store description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button className="btn btn-primary"><Plus size={17} /> Create store</button>
    </form>
  );
}

function Products({ activeStore }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", discountPrice: "", category: "", quantity: "", sku: "", featured: false, description: "", tags: "" });
  const isGrocery = activeStore?.category === "grocery";

  async function load() {
    if (!activeStore) return;
    const { data } = await api.get(`/stores/${activeStore.id}/products`);
    setProducts(data.products);
  }

  useEffect(() => { load(); }, [activeStore?.id]);

  async function submit(event) {
    event.preventDefault();
    await api.post(`/stores/${activeStore.id}/products`, form);
    toast.success("Product added");
    setForm({ name: "", price: "", discountPrice: "", category: "", quantity: "", sku: "", featured: false, description: "", tags: "" });
    load();
  }

  if (!activeStore) return <Placeholder title="Products" text="Create a store before adding products." />;
  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
        <h1 className="text-xl font-black">Add product</h1>
        <div className="grid gap-3 md:grid-cols-3">
          {["name", "price", "discountPrice", "category", "quantity", "sku", "tags"].map((field) => (
            <input key={field} className="input" placeholder={field} value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          ))}
          {isGrocery ? ["weight", "unit", "expiryDate"].map((field) => <input key={field} className="input" placeholder={field} type={field === "expiryDate" ? "date" : "text"} value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />) : null}
        </div>
        <textarea className="input min-h-20" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured product</label>
        <button className="btn btn-primary">Add product</button>
      </form>
      <div className="grid gap-3">
        {products.map((product) => <ProductRow key={product.id} product={product} reload={load} />)}
      </div>
    </div>
  );
}

function ProductRow({ product, reload }) {
  async function remove() {
    await api.delete(`/products/${product.id}`);
    toast.success("Product deleted");
    reload();
  }
  return <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-soft dark:bg-slate-900"><div><p className="font-bold">{product.name}</p><p className="text-sm text-slate-500">{product.category} · ₹{product.price}</p></div><button className="btn btn-ghost" onClick={remove}>Delete</button></div>;
}

function ThemeSettings({ store, themes, refresh }) {
  const [order, setOrder] = useState(store?.sectionOrder || ["hero", "featured", "products", "about", "contact"]);
  const [hidden, setHidden] = useState(store?.hiddenSections || []);
  const [themeId, setThemeId] = useState(store?.themeId || "");

  useEffect(() => {
    setOrder(store?.sectionOrder || ["hero", "featured", "products", "about", "contact"]);
    setHidden(store?.hiddenSections || []);
    setThemeId(store?.themeId || "");
  }, [store?.id]);

  function move(index, direction) {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  async function save() {
    await api.put(`/stores/${store.id}`, { themeId });
    await api.patch(`/stores/${store.id}/sections`, { sectionOrder: order, hiddenSections: hidden });
    toast.success("Theme settings saved");
    refresh();
  }

  if (!store) return <Placeholder title="Theme Settings" text="Create a store to customize theme sections." />;
  return (
    <div className="space-y-5 rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
      <h1 className="text-xl font-black">Theme Settings</h1>
      <select className="input max-w-md" value={themeId} onChange={(e) => setThemeId(e.target.value)}>{themes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select>
      <div className="grid gap-2">
        {order.map((section, index) => (
          <div key={section} draggable onDragStart={(event) => event.dataTransfer.setData("index", index)} onDrop={(event) => { const from = Number(event.dataTransfer.getData("index")); const next = [...order]; const [item] = next.splice(from, 1); next.splice(index, 0, item); setOrder(next); }} onDragOver={(event) => event.preventDefault()} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <label className="flex items-center gap-2 text-sm font-semibold capitalize"><input type="checkbox" checked={!hidden.includes(section)} onChange={(e) => setHidden(e.target.checked ? hidden.filter((item) => item !== section) : [...hidden, section])} /> {section}</label>
            <div className="flex gap-2"><button className="btn btn-ghost px-3" onClick={() => move(index, -1)} type="button">Up</button><button className="btn btn-ghost px-3" onClick={() => move(index, 1)} type="button">Down</button></div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={save}>Save builder settings</button>
    </div>
  );
}

function StoreSettings({ store, themes, refresh }) {
  const [form, setForm] = useState(store || {});
  useEffect(() => setForm(store || {}), [store?.id]);
  if (!store) return <Placeholder title="Store Settings" text="Create a store before editing store settings." />;
  async function save(event) {
    event.preventDefault();
    await api.put(`/stores/${store.id}`, form);
    toast.success("Store saved");
    refresh();
  }
  return (
    <form onSubmit={save} className="space-y-4 rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
      <h1 className="text-xl font-black">Store Settings</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {["name", "whatsappNumber", "email", "address", "instagramLink", "facebookLink", "youtubeLink", "logoUrl", "bannerUrl", "upiId", "paymentQrUrl"].map((field) => <input key={field} className="input" placeholder={field} value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />)}
        <select className="input" value={form.themeId || ""} onChange={(e) => setForm({ ...form, themeId: e.target.value })}>{themes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select>
      </div>
      <div className="flex flex-wrap gap-4 text-sm font-semibold">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.codEnabled !== false} onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })} /> COD enabled</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.upiEnabled !== false} onChange={(e) => setForm({ ...form, upiEnabled: e.target.checked })} /> UPI enabled</label>
      </div>
      <textarea className="input min-h-24" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button className="btn btn-primary">Save settings</button>
    </form>
  );
}

function Placeholder({ title, text }) {
  return <div className="rounded-lg bg-white p-8 shadow-soft dark:bg-slate-900"><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 text-slate-500">{text}</p></div>;
}
