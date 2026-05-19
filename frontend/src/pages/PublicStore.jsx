import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Heart, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/client.js";
import { Loader } from "../components/Loader.jsx";
import { currency, whatsappUrl } from "../utils/format.js";

const themeMap = {
  "modern-shopping": lazy(() => import("../themes/ModernShoppingTheme.jsx")),
  minimal: lazy(() => import("../themes/MinimalTheme.jsx")),
  grocery: lazy(() => import("../themes/GroceryTheme.jsx")),
  "premium-catalog": lazy(() => import("../themes/PremiumCatalogTheme.jsx")),
  "uttarakhand-aipan": lazy(() => import("../themes/UttarakhandAipanTheme.jsx"))
};

export default function PublicStore() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(`cart:${slug}`) || "[]"));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem(`favorites:${slug}`) || "[]"));
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const query = useMemo(() => ({ search: params.get("search") || "", category: params.get("category") || "", page: params.get("page") || 1 }), [params]);

  useEffect(() => {
    localStorage.setItem(`cart:${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  useEffect(() => {
    localStorage.setItem(`favorites:${slug}`, JSON.stringify(favorites));
  }, [favorites, slug]);

  useEffect(() => {
    setLoading(true);
    api.get(`/stores/public/${slug}`, { params: query }).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [slug, query.search, query.category, query.page]);

  if (loading) return <Loader label="Opening store" />;
  if (!data) return <div className="grid min-h-screen place-items-center">Store not found</div>;

  const key = data.store.Theme?.key || "modern-shopping";
  const Theme = themeMap[key] || themeMap["modern-shopping"];
  const title = `${data.store.name} | LocalStore`;
  const description = data.store.description || `Shop products from ${data.store.name}`;

  function updateFilter(next) {
    const merged = { ...query, ...next, page: next.page || 1 };
    Object.entries(merged).forEach(([name, value]) => (value ? params.set(name, value) : params.delete(name)));
    setParams(params);
  }

  function addToCart(product, quantity = 1) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...items, { ...product, quantity }];
    });
    toast.success("Added to cart");
  }

  function buyNow(product, quantity = 1) {
    addToCart(product, quantity);
    setCheckoutOpen(true);
  }

  function toggleFavorite(product) {
    setFavorites((items) => {
      const exists = items.includes(product.id);
      toast.success(exists ? "Removed from favourites" : "Added to favourites");
      return exists ? items.filter((id) => id !== product.id) : [...items, product.id];
    });
  }

  function updateCartQuantity(productId, delta) {
    setCart((items) =>
      items
        .map((item) => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={data.store.bannerUrl || data.store.logoUrl || ""} />
        <link rel="canonical" href={`${import.meta.env.VITE_PUBLIC_URL || ""}/store/${slug}`} />
      </Helmet>
      <Suspense fallback={<Loader label="Loading theme" />}>
        <Theme
          {...data}
          query={query}
          updateFilter={updateFilter}
          cartActions={{
            onToggleFavorite: toggleFavorite,
            onAddToCart: addToCart,
            onBuyNow: buyNow,
            favoriteIds: favorites
          }}
        />
      </Suspense>
      <FloatingCart count={cart.reduce((sum, item) => sum + item.quantity, 0)} favorites={favorites.length} onOpen={() => setCheckoutOpen(true)} />
      {checkoutOpen ? (
        <CheckoutModal
          store={data.store}
          cart={cart}
          setCart={setCart}
          updateCartQuantity={updateCartQuantity}
          onClose={() => setCheckoutOpen(false)}
        />
      ) : null}
    </>
  );
}

function FloatingCart({ count, favorites, onOpen }) {
  if (!count && !favorites) return null;
  return (
    <button className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-soft" onClick={onOpen}>
      <ShoppingCart size={18} /> {count} item{count === 1 ? "" : "s"}
      {favorites ? <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1"><Heart size={14} fill="currentColor" /> {favorites}</span> : null}
    </button>
  );
}

function CheckoutModal({ store, cart, setCart, updateCartQuantity, onClose }) {
  const codEnabled = store.codEnabled !== false;
  const upiEnabled = store.upiEnabled !== false;
  const [paymentMode, setPaymentMode] = useState(codEnabled ? "cod" : "upi");
  const total = cart.reduce((sum, item) => sum + Number(item.discountPrice || item.price || 0) * item.quantity, 0);
  const upiId = store.upiId || "";
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(store.name)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order from ${store.name}`)}`;
  const qrUrl = store.paymentQrUrl || (upiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`
    : "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Set%20UPI%20ID%20in%20store%20settings");
  const message = `Hi, I want to place an order from ${store.name}.\n\n${cart.map((item) => `- ${item.name} x ${item.quantity} = ${currency(Number(item.discountPrice || item.price) * item.quantity)}`).join("\n")}\n\nTotal: ${currency(total)}\nPayment: ${paymentMode === "cod" ? "Cash on Delivery" : "UPI"}`;

  function placeOrder() {
    window.open(whatsappUrl(store.whatsappNumber, message), "_blank", "noopener,noreferrer");
    toast.success("Order shared on WhatsApp");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/45 p-0 sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-t-2xl bg-white p-5 shadow-soft dark:bg-slate-950 sm:rounded-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">Checkout</h2>
            <p className="text-sm text-slate-500">Cart, COD and UPI payment options</p>
          </div>
          <button className="btn btn-ghost px-3" onClick={onClose}><X size={18} /></button>
        </div>

        {!cart.length ? <p className="py-10 text-center text-slate-500">Your cart is empty.</p> : (
          <>
            <div className="mt-5 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="text-sm text-slate-500">{currency(item.discountPrice || item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 dark:bg-slate-800" onClick={() => updateCartQuantity(item.id, -1)}><Minus size={15} /></button>
                    <span className="w-8 text-center font-black">{item.quantity}</span>
                    <button className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 dark:bg-slate-800" onClick={() => updateCartQuantity(item.id, 1)}><Plus size={15} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <div className="flex items-center justify-between text-lg font-black">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {codEnabled ? <button className={`btn ${paymentMode === "cod" ? "btn-primary" : "btn-ghost"}`} onClick={() => setPaymentMode("cod")}>Cash on Delivery</button> : null}
                {upiEnabled ? <button className={`btn ${paymentMode === "upi" ? "btn-primary" : "btn-ghost"}`} onClick={() => setPaymentMode("upi")}>UPI QR</button> : null}
              </div>
              {!codEnabled && !upiEnabled ? <p className="mt-4 text-sm text-red-600">No payment method is enabled for this store yet.</p> : null}
              {paymentMode === "upi" && upiEnabled ? (
                <div className="mt-4 grid gap-4 rounded-lg bg-white p-4 text-center dark:bg-slate-950 sm:grid-cols-[220px_1fr] sm:text-left">
                  <img src={qrUrl} alt="UPI payment QR" className="mx-auto h-44 w-44 rounded-lg border border-slate-200 bg-white p-2" />
                  <div>
                    <p className="font-black">Scan and pay by UPI</p>
                    <p className="mt-2 text-sm text-slate-500">{upiId ? `UPI ID: ${upiId}` : "Set a UPI ID in store settings for a real payment QR."}</p>
                    {upiId ? <a className="btn btn-primary mt-4" href={upiUrl}>Open UPI App</a> : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-3">
              <button className="btn btn-ghost" onClick={() => setCart([])}>Clear cart</button>
              <button className="btn btn-primary" onClick={placeOrder}>Place order on WhatsApp</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
