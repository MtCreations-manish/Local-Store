import { assetFallback } from "../api/client.js";
import { AboutContact, FilterBar, orderedSections, ProductGrid, StoreFooter, StoreHeader } from "./ThemeShell.jsx";

export default function MinimalTheme({ store, products, categories, query, updateFilter, cartActions }) {
  const sectionMap = {
    hero: <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center"><div><h1 className="text-4xl font-black md:text-5xl">{store.name}</h1><p className="mt-4 leading-7 text-slate-600">{store.description}</p></div><img src={store.bannerUrl || assetFallback} alt={store.name} className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft" /></section>,
    products: <><FilterBar categories={categories} query={query} updateFilter={updateFilter} /><ProductGrid products={products} store={store} compact cartActions={cartActions} /></>,
    featured: null,
    about: <AboutContact store={store} />,
    contact: null
  };
  return (
    <div className="min-h-screen bg-white">
      <StoreHeader store={store} />
      {orderedSections(store).map((section) => <div key={section}>{sectionMap[section]}</div>)}
      <StoreFooter store={store} />
    </div>
  );
}
