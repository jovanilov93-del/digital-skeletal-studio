import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border mt-24">
    <div className="container py-14 grid gap-10 md:grid-cols-4">
      <div>
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          Anatomia<span className="text-primary">3D</span>
        </Link>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          Interactive 3D human anatomy for students, educators and clinicians.
        </p>
      </div>
      {[
        { title: "Product", items: ["3D Viewer", "Atlas", "Quizzes", "Pricing"] },
        { title: "Resources", items: ["Documentation", "Tutorials", "API", "Changelog"] },
        { title: "Company", items: ["About", "Careers", "Contact", "Privacy"] },
      ].map((c) => (
        <div key={c.title}>
          <h4 className="text-sm font-semibold mb-3">{c.title}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {c.items.map((i) => (<li key={i}><a className="hover:text-foreground transition-colors" href="#">{i}</a></li>))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Anatomia3D. Educational content for learning purposes.
    </div>
  </footer>
);
