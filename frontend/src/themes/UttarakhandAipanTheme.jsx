import { Mountain, Search, Sparkles, Trees, Waves } from "lucide-react";
import { assetFallback } from "../api/client.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { whatsappUrl } from "../utils/format.js";
import { orderedSections, StoreFooter, StoreHeader } from "./ThemeShell.jsx";

const mountainImage = "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=85";

function AipanTitle({ eyebrow, title, text, light = false }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`text-xs font-black uppercase tracking-[0.28em] ${light ? "text-[#fff8e9]" : "text-[#b70d19]"}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-black md:text-5xl ${light ? "text-[#fffdf5]" : "text-[#3b1711]"}`}>{title}</h2>
      {text ? <p className={`mx-auto mt-4 max-w-2xl leading-7 ${light ? "text-[#fff8e9]/82" : "text-[#704035]"}`}>{text}</p> : null}
    </div>
  );
}

function AipanProductGrid({ products, store, compact = false, cartActions }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
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

function AipanFilter({ categories, query, updateFilter }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-5">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 text-[#b70d19]" size={18} />
        <input className="input pl-10" placeholder="Search local favorites" value={query.search} onChange={(event) => updateFilter({ search: event.target.value })} />
      </div>
      <button className={`btn ${query.category ? "btn-ghost" : "btn-primary"}`} onClick={() => updateFilter({ category: "" })}>All</button>
      {categories.map((category) => (
        <button key={category} className={`btn ${query.category === category ? "btn-primary" : "btn-ghost"}`} onClick={() => updateFilter({ category })}>{category}</button>
      ))}
    </div>
  );
}

export default function UttarakhandAipanTheme({ store, products, categories, query, updateFilter, cartActions }) {
  const featured = products.filter((product) => product.featured);
  const visibleFeatured = featured.length ? featured : products.slice(0, 4);
  const hero = store.bannerUrl || mountainImage;
  const sections = {
    hero: (
      <section className="relative min-h-[620px] overflow-hidden bg-[#6f0710] text-[#fffdf5]">
        <img src={hero} alt={store.name} className="absolute inset-0 h-full w-full object-cover opacity-42" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6f0710] via-[#8e0a14]/82 to-[#184137]/45" />
        <div className="aipan-dots absolute inset-0 opacity-40" />
        <div className="aipan-border absolute left-0 top-0 h-5 w-full" />
        <div className="aipan-border absolute bottom-0 left-0 h-5 w-full" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#f4d89c]">Uttarakhand Folk Art Store</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none md:text-7xl">{store.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#fff8e9]/88">{store.description || "A vibrant storefront inspired by Aipan motifs, Himalayan calm, pine forests, temple bells, and local craft warmth."}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-primary" href="#products">Explore Collection</a>
              <a className="btn btn-ghost" href={whatsappUrl(store.whatsappNumber)} target="_blank" rel="noreferrer">WhatsApp Order</a>
            </div>
          </div>
          <div className="aipan-mandala relative hidden aspect-square rounded-full border-4 border-[#fffdf5]/75 bg-[#b70d19]/80 shadow-[0_28px_70px_rgba(0,0,0,0.3)] md:block">
            <div className="absolute inset-14 rounded-full border-2 border-[#fffdf5]/80" />
            <div className="absolute inset-28 rounded-full bg-[#fffdf5]" />
            <Sparkles className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-[#b70d19]" size={42} />
          </div>
        </div>
      </section>
    ),
    featured: (
      <section className="bg-[#fff8e9] py-14">
        <AipanTitle eyebrow="बेस्ट सेलर्स" title="Aipan Picks" text="A curated row of featured products framed with Uttarakhand-inspired color, craft, and warmth." />
        <AipanProductGrid products={visibleFeatured} store={store} compact cartActions={cartActions} />
      </section>
    ),
    products: (
      <section id="products" className="bg-[#fffdf5] py-14">
        <AipanTitle eyebrow="Shop The Collection" title="Local Store Catalog" text="Search by name, filter by category, and connect directly through WhatsApp for fast local ordering." />
        <AipanFilter categories={categories} query={query} updateFilter={updateFilter} />
        <AipanProductGrid products={products} store={store} cartActions={cartActions} />
      </section>
    ),
    about: (
      <>
        <section className="relative overflow-hidden bg-[#8e0a14] py-16 text-[#fffdf5]">
          <div className="aipan-dots absolute inset-0 opacity-45" />
          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
            {[
              [Mountain, "Himalayan Spirit", "A store mood inspired by Kumaon and Garhwal landscapes."],
              [Trees, "Folk Craft Detail", "Aipan-style borders, dots, and mandala forms shape the visual rhythm."],
              [Waves, "Direct Local Orders", "Simple browsing with WhatsApp-led purchase conversations."]
            ].map(([Icon, title, text]) => (
              <article key={title} className="aipan-feature-card rounded-lg border p-6 text-center shadow-none">
                <Icon className="mx-auto mb-4 text-[#f4d89c]" size={34} />
                <h3 className="text-2xl font-black text-[#fffdf5]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#fff8e9]/78">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-[#fff8e9] px-4 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b70d19]">About The Store</p>
            <h2 className="mt-2 text-4xl font-black text-[#3b1711]">Rooted In Place</h2>
            <p className="mt-5 text-lg leading-8 text-[#704035]">{store.description || "This storefront brings together modern commerce and Uttarakhand folk-art language, creating a rich local identity for every product."}</p>
          </div>
        </section>
      </>
    ),
    contact: null
  };

  return (
    <div className="aipan-theme min-h-screen">
      <StoreHeader store={store} />
      {orderedSections(store).map((section) => <div key={section}>{sections[section]}</div>)}
      <StoreFooter store={store} />
    </div>
  );
}
