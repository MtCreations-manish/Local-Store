import { motion } from "framer-motion";
import { assetFallback } from "../api/client.js";
import { AboutContact, FilterBar, orderedSections, ProductGrid, StoreFooter, StoreHeader } from "./ThemeShell.jsx";

export default function ModernShoppingTheme({ store, products, categories, query, updateFilter, cartActions }) {
  const featured = products.filter((product) => product.featured);
  const sections = orderedSections(store);
  const sectionMap = {
    hero: (
      <section className="relative overflow-hidden bg-ink text-white">
        <img src={store.bannerUrl || assetFallback} alt={store.name} className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="relative mx-auto max-w-7xl px-4 py-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-4xl font-black md:text-6xl">{store.name}</motion.h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{store.description}</p>
        </div>
      </section>
    ),
    featured: featured.length ? <><h2 className="mx-auto max-w-7xl px-4 pt-10 text-2xl font-black">Featured Products</h2><ProductGrid products={featured} store={store} cartActions={cartActions} /></> : null,
    products: <><FilterBar categories={categories} query={query} updateFilter={updateFilter} /><ProductGrid products={products} store={store} cartActions={cartActions} /></>,
    about: <AboutContact store={store} />,
    contact: null
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader store={store} />
      {sections.map((section) => <div key={section}>{sectionMap[section]}</div>)}
      <StoreFooter store={store} />
    </div>
  );
}
