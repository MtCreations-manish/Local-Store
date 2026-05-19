import { Moon, Store, Sun } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Navbar() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDark((value) => !value);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-black">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><Store size={19} /></span>
          LocalStore
        </Link>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost px-3" onClick={toggleDark} aria-label="Toggle dark mode">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          {user ? (
            <>
              <NavLink className="btn btn-ghost" to="/dashboard">Dashboard</NavLink>
              <button className="btn btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-ghost" to="/login">Login</NavLink>
              <NavLink className="btn btn-primary" to="/register">Start</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
