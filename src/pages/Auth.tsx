import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

const AuthPage = () => {
  const [params] = useSearchParams();
  const isSignup = params.get("mode") === "signup";

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-hero p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-anatomy" />
        <Link to="/" className="relative flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center"><Activity className="h-4 w-4 text-primary-foreground" /></div>
          Anatomia<span className="text-primary">3D</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-bold mb-3">"The closest thing to a real cadaver lab on a screen."</h2>
          <p className="text-muted-foreground">— Dr. Elena Marquez, Professor of Anatomy</p>
        </div>
        <div className="relative text-xs text-muted-foreground">© Anatomia3D</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="text-sm text-muted-foreground mb-8">{isSignup ? "Start exploring the human body in 3D." : "Sign in to continue learning."}</p>

          <form className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs font-medium mb-1.5 block">Full name</label>
                <input className="w-full h-10 px-3 rounded-md bg-secondary border border-border focus:border-primary outline-none text-sm" placeholder="Jane Doe" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium mb-1.5 block">Email</label>
              <input type="email" className="w-full h-10 px-3 rounded-md bg-secondary border border-border focus:border-primary outline-none text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block">Password</label>
              <input type="password" className="w-full h-10 px-3 rounded-md bg-secondary border border-border focus:border-primary outline-none text-sm" placeholder="••••••••" />
            </div>
            <Button variant="hero" className="w-full" type="button">{isSignup ? "Create account" : "Sign in"}</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> OR <div className="h-px bg-border flex-1" />
          </div>
          <Button variant="glow" className="w-full">Continue with Google</Button>

          <p className="text-center text-xs text-muted-foreground mt-8">
            {isSignup ? "Already have an account? " : "New here? "}
            <Link to={isSignup ? "/auth" : "/auth?mode=signup"} className="text-primary hover:underline">
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
          <p className="text-center text-[10px] text-muted-foreground mt-3">
            Auth wiring (Lovable Cloud) comes next — UI is ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
