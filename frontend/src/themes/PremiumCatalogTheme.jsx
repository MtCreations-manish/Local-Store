import { assetFallback } from "../api/client.js";
import { AboutContact, FilterBar, orderedSections, ProductGrid, StoreFooter, StoreHeader } from "./ThemeShell.jsx";

export default function PremiumCatalogTheme({ store, products, categories, query, updateFilter, cartActions }) {
  const heroImage = store.bannerUrl || "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=85";
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const sectionMap = {
    hero: (
      <section className="relative min-h-[520px] overflow-hidden bg-[#24160f] text-[#fffaf2]">
        <img src={heroImage} alt={store.name} className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#24160f]/95 via-[#24160f]/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-16">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#d7a86e]">Experience</p>
            <h1 className="text-5xl font-black leading-none md:text-7xl">{store.name}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#f7efe4]/85">{store.description || "A refined local catalog crafted with warmth, taste, and thoughtful detail."}</p>
            <a className="btn btn-primary mt-7" href="#products">Shop Now</a>
          </div>
        </div>
      </section>
    ),
    featured: (
      <section className="bg-[#f7efe4] px-4 py-14">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9854a]">Best Sellers</p>
          <h2 className="mt-2 text-3xl font-black text-[#24160f]">Customer Favorites</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#7b4b32]">Discover our most-loved picks, presented in a quiet premium catalog style.</p>
        </div>
        <ProductGrid products={featured.length ? featured : products.slice(0, 3)} store={store} compact cartActions={cartActions} />
      </section>
    ),
    products: (
      <section id="products" className="bg-[#fffaf2] py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9854a]">Catalog</p>
          <h2 className="mt-2 text-3xl font-black text-[#24160f]">Explore The Collection</h2>
        </div>
        <FilterBar categories={categories} query={query} updateFilter={updateFilter} />
        <ProductGrid products={products} store={store} cartActions={cartActions} />
      </section>
    ),
    about: (
      <>
        <section className="relative overflow-hidden bg-[#24160f] text-[#fffaf2]">
          <img src={assetFallback} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="relative mx-auto max-w-7xl px-4 py-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d7a86e]">Delivered To Your Door</p>
            <h2 className="mt-3 max-w-lg text-4xl font-black">A premium store experience for local shoppers.</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#f7efe4]/80">{store.address || "Order online and connect directly through WhatsApp for fast local service."}</p>
          </div>
        </section>
        <section className="bg-[#f7efe4] px-4 py-14 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b9854a]">About Us</p>
            <h2 className="mt-2 text-3xl font-black text-[#24160f]">Our Story</h2>
            <p className="mt-4 leading-8 text-[#6f4934]">{store.description || "We bring a thoughtful, premium catalog experience to local commerce with simple browsing and direct ordering."}</p>
          </div>
        </section>
      </>
    ),
    contact: null
  };
  return (
    <div className="luxury-theme min-h-screen">
      <StoreHeader store={store} />
      {orderedSections(store).map((section) => <div key={section}>{sectionMap[section]}</div>)}
      <section className="bg-[#fffaf2] px-4 py-14 text-center">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {["Curated catalog", "Direct WhatsApp order", "Local service"].map((item) => (
            <div key={item} className="rounded-lg border border-[#b9854a]/20 bg-[#f7efe4] p-6">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#b9854a]/40" />
              <h3 className="text-lg font-black text-[#24160f]">{item}</h3>
            </div>
          ))}
        </div>
      </section>
      <StoreFooter store={store} />
    </div>
  );
}
