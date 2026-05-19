import { Leaf, Search } from "lucide-react";
import { assetFallback } from "../api/client.js";
import { AboutContact, orderedSections, ProductGrid, StoreFooter, StoreHeader } from "./ThemeShell.jsx";

export default function GroceryTheme({ store, products, categories, query, updateFilter, cartActions }) {
  const sectionMap = {
    hero: <section className="bg-fresh text-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_0.8fr] md:items-center"><div><p className="flex items-center gap-2 text-sm font-bold uppercase"><Leaf size={18} /> Fresh local grocery</p><h1 className="mt-3 text-4xl font-black md:text-6xl">{store.name}</h1><p className="mt-4 max-w-xl text-white/85">{store.description}</p></div><img src={store.bannerUrl || assetFallback} alt={store.name} className="aspect-[4/3] rounded-lg object-cover shadow-soft" /></div></section>,
    products: <><div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 py-5"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="input pl-10" placeholder="Search fruits, vegetables, staples" value={query.search} onChange={(e) => updateFilter({ search: e.target.value })} /></div>{["", ...categories].map((category) => <button key={category || "all"} className={`btn ${query.category === category ? "btn-primary" : "btn-ghost"}`} onClick={() => updateFilter({ category })}>{category || "All"}</button>)}</div><ProductGrid products={products} store={store} cartActions={cartActions} /></>,
    featured: null,
    about: <AboutContact store={store} />,
    contact: null
  };
  return (
    <div className="min-h-screen bg-lime-50">
      <StoreHeader store={store} />
      {orderedSections(store).map((section) => <div key={section}>{sectionMap[section]}</div>)}
      <StoreFooter store={store} />
    </div>
  );
}
