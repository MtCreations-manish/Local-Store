export function Loader({ label = "Loading" }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="rounded-xl bg-white px-6 py-5 text-sm font-medium text-slate-500 shadow-soft dark:bg-slate-900">{label}...</div>
    </div>
  );
}
