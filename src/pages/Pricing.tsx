import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const TIERS = [
  { name: "Free", price: "0", period: "forever", desc: "Get started with the basics.", features: ["Basic 3D viewer", "5 body systems", "10 quizzes / month", "Community support"], cta: "Start free", variant: "glow" as const },
  { name: "Pro", price: "12", period: "/ month", desc: "For serious students.", features: ["Full 3D viewer", "All 11 body systems", "Unlimited quizzes", "Histology slides", "Progress tracking", "12 languages"], cta: "Start Pro trial", variant: "hero" as const, popular: true },
  { name: "Institution", price: "Custom", period: "", desc: "Schools, universities & hospitals.", features: ["Everything in Pro", "Classroom dashboard", "LMS integration (LTI)", "Bulk seats", "SSO & SAML", "Dedicated support"], cta: "Contact sales", variant: "glow" as const },
];

const PricingPage = () => (
  <div className="container py-14">
    <div className="text-center max-w-2xl mx-auto mb-14">
      <div className="text-xs uppercase text-primary tracking-wide font-semibold mb-2">Pricing</div>
      <h1 className="text-4xl md:text-5xl font-bold mb-3">Simple plans for every learner</h1>
      <p className="text-muted-foreground">Start free. Upgrade when you need more. Cancel anytime.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {TIERS.map((t) => (
        <div key={t.name} className={`relative rounded-2xl border p-8 ${t.popular ? "border-primary shadow-glow bg-card" : "border-border bg-card"}`}>
          {t.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">
              Most popular
            </div>
          )}
          <h3 className="text-xl font-semibold">{t.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5">{t.desc}</p>
          <div className="flex items-baseline gap-1 mb-6">
            {t.price !== "Custom" && <span className="text-sm text-muted-foreground">$</span>}
            <span className="text-4xl font-bold">{t.price}</span>
            <span className="text-sm text-muted-foreground">{t.period}</span>
          </div>
          <Button asChild variant={t.variant} className="w-full mb-6"><Link to="/auth?mode=signup">{t.cta}</Link></Button>
          <ul className="space-y-3 text-sm">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default PricingPage;
