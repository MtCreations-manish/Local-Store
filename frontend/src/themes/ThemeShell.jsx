import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { ProductCard } from "../components/ProductCard.jsx";
import { whatsappUrl } from "../utils/format.js";

export function StoreHeader({ store, mode = "light" }) {
  return (
    <header className={`sticky top-0 z-20 border-b backdrop-blur ${mode === "dark" ? "border-white/10 bg-slate-950/80 text-white" : "border-slate-200 bg-white/85"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {store.logoUrl ? <img src={store.logoUrl} alt={store.name} className="h-10 w-10 rounded-lg object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand font-black text-white">{store.name?.[0]}</span>}
          <div><p className="font-black">{store.name}</p><p className="text-xs capitalize opacity-70">{store.category} store</p></div>
        </div>
        <a className="btn btn-primary" href={whatsappUrl(store.whatsappNumber)} target="_blank" rel="noreferrer"><Phone size={16} /> WhatsApp</a>
      </div>
    </header>
  );
}

export function FilterBar({ categories, query, updateFilter, dark = false }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-5">
      <input className="input max-w-md" placeholder="Search products" value={query.search} onChange={(e) => updateFilter({ search: e.target.value })} />
      <select className="input max-w-xs" value={query.category} onChange={(e) => updateFilter({ category: e.target.value })}>
        <option value="">All categories</option>
        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
    </div>
  );
}

export function ProductGrid({ products, store, compact = false, cartActions }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          store={store}
          compact={compact}
          {...cartActions}
          isFavorite={cartActions?.favoriteIds?.includes(product.id)}
        />
      ))}
    </div>
  );
}

export function StoreFooter({ store, dark = false }) {
  const links = [
    [store.instagramLink, Instagram],
    [store.facebookLink, Facebook],
    [store.youtubeLink, Youtube]
  ].filter(([href]) => href);
  return (
    <footer className={dark ? "bg-slate-950 text-white" : "bg-white"}>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 md:grid-cols-3">
        <div><h3 className="text-xl font-black">{store.name}</h3><p className="mt-2 text-sm opacity-70">{store.description}</p></div>
        <div className="space-y-2 text-sm opacity-80">
          {store.address ? <p className="flex gap-2"><MapPin size={16} /> {store.address}</p> : null}
          {store.email ? <p className="flex gap-2"><Mail size={16} /> {store.email}</p> : null}
        </div>
        <div className="flex gap-2 md:justify-end">
          {links.map(([href, Icon]) => <a key={href} className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white" href={href} target="_blank" rel="noreferrer"><Icon size={18} /></a>)}
        </div>
      </div>
    </footer>
  );
}

export function AboutContact({ store, dark = false }) {
  return (
    <section className={dark ? "bg-slate-900 text-white" : "bg-slate-50"}>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-2">
        <div><h2 className="text-2xl font-black">About</h2><p className="mt-3 leading-7 opacity-75">{store.description}</p></div>
        <div><h2 className="text-2xl font-black">Contact</h2><p className="mt-3 opacity-75">{store.address}</p><a className="btn btn-primary mt-4" href={whatsappUrl(store.whatsappNumber)} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div>
      </div>
    </section>
  );
}

export function orderedSections(store) {
  const defaults = ["hero", "featured", "products", "about", "contact"];
  const hidden = new Set(store.hiddenSections || []);
  return (store.sectionOrder?.length ? store.sectionOrder : defaults).filter((section) => !hidden.has(section));
}
