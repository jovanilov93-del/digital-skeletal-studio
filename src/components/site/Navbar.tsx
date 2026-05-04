import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/viewer", label: "3D Viewer" },
  { to: "/atlas", label: "Atlas" },
  { to: "/quizzes", label: "Quizzes" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg tracking-tight">Anatomia<span className="text-primary">3D</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          <Button asChild variant="hero" size="sm"><Link to="/auth?mode=signup">Get started</Link></Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary text-sm">
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="ghost" size="sm" className="flex-1"><Link to="/auth">Sign in</Link></Button>
              <Button asChild variant="hero" size="sm" className="flex-1"><Link to="/auth?mode=signup">Get started</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
