import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { assetFallback } from "../api/client.js";
import { currency, whatsappUrl } from "../utils/format.js";

export function ProductCard({ product, store, compact = false, onAddToCart, onBuyNow, onToggleFavorite, isFavorite = false }) {
  const [quantity, setQuantity] = useState(1);
  const image = product.images?.[0]?.url || assetFallback;
  const disabled = product.availability === false;

  function changeQuantity(delta) {
    setQuantity((current) => Math.max(1, Math.min(99, current + delta)));
  }

  return (
    <motion.article layout whileHover={{ y: -4 }} className="overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <div className="relative">
        <img src={image} alt={product.name} className={compact ? "h-36 w-full object-cover" : "h-48 w-full object-cover"} loading="lazy" />
        <button className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 shadow ${isFavorite ? "text-red-600" : "text-slate-600"}`} onClick={() => onToggleFavorite?.(product)} aria-label="Favourite product">
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{product.category || "Catalog"}</p>
          <h3 className="line-clamp-2 text-base font-bold">{product.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black">{currency(product.discountPrice || product.price)}</span>
          {product.discountPrice ? <span className="text-sm text-slate-400 line-through">{currency(product.price)}</span> : null}
        </div>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button className="grid h-8 w-8 place-items-center rounded-md bg-white dark:bg-slate-900" onClick={() => changeQuantity(-1)} aria-label="Decrease quantity"><Minus size={15} /></button>
          <span className="min-w-10 text-center text-sm font-black">{quantity}</span>
          <button className="grid h-8 w-8 place-items-center rounded-md bg-white dark:bg-slate-900" onClick={() => changeQuantity(1)} aria-label="Increase quantity"><Plus size={15} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-ghost px-3" disabled={disabled} onClick={() => onAddToCart?.(product, quantity)}><ShoppingCart size={15} /> Cart</button>
          <button className="btn btn-primary px-3" disabled={disabled} onClick={() => onBuyNow?.(product, quantity)}><Zap size={15} /> Buy</button>
        </div>
        <a className="btn btn-ghost w-full" href={whatsappUrl(store?.whatsappNumber, `Hi, I want to enquire about ${product.name}`)} target="_blank" rel="noreferrer">
          <ShoppingBag size={16} /> Enquire
        </a>
      </div>
    </motion.article>
  );
}
