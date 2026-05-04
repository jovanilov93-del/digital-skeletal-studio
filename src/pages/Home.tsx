import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnatomyScene } from "@/components/anatomy/AnatomyScene";
import { useState } from "react";
import { Brain, Heart, Bone, Dna, Eye, Layers, Microscope, GraduationCap, Globe2, Sparkles, ArrowRight, Play } from "lucide-react";

const SYSTEMS = [
  { id: "skeletal", label: "Skeletal", icon: Bone },
  { id: "muscular", label: "Muscular", icon: Layers },
  { id: "nervous", label: "Nervous", icon: Brain },
  { id: "circulatory", label: "Circulatory", icon: Heart },
];

const FEATURES = [
  { icon: Microscope, title: "Microscopic detail", desc: "Explore from full body down to individual structures with anatomically accurate models." },
  { icon: Layers, title: "Layer-by-layer dissection", desc: "Peel away skin, muscle, organs and bone to study every system independently." },
  { icon: GraduationCap, title: "Built for learning", desc: "Curated lessons, labelled views and assessments for every level of study." },
  { icon: Globe2, title: "12 languages", desc: "Localised terminology in Latin and modern languages for global classrooms." },
  { icon: Eye, title: "AR & VR ready", desc: "View specimens in augmented reality or fully immersive virtual reality." },
  { icon: Dna, title: "Histology & pathology", desc: "Slide-level cellular views alongside common pathological variations." },
];

const HomePage = () => {
  const [system, setSystem] = useState("muscular");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-anatomy" />
        <div className="container relative grid lg:grid-cols-2 gap-10 py-20 lg:py-28 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary">
              <Sparkles className="h-3 w-3" /> Interactive 3D Human Anatomy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Explore the human body like <span className="text-gradient">never before</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              A complete 3D anatomy platform for students, educators and clinicians. Dissect, label, quiz and master every system of the human body.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl" variant="hero">
                <Link to="/viewer">Launch 3D Viewer <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="glow">
                <Link to="/atlas"><Play className="h-4 w-4" /> Explore Atlas</Link>
              </Button>
            </div>
            <div className="flex gap-8 pt-6 text-sm">
              <div><div className="text-2xl font-bold text-primary">12k+</div><div className="text-muted-foreground">Structures</div></div>
              <div><div className="text-2xl font-bold text-primary">500+</div><div className="text-muted-foreground">Lessons</div></div>
              <div><div className="text-2xl font-bold text-primary">2M+</div><div className="text-muted-foreground">Students</div></div>
            </div>
          </div>

          <div className="relative h-[500px] rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden shadow-elegant">
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {SYSTEMS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSystem(s.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
                    system === s.id ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </button>
              ))}
            </div>
            <div className="absolute bottom-3 right-3 z-10 text-[10px] text-muted-foreground bg-background/60 px-2 py-1 rounded">
              Drag to rotate · click hotspots
            </div>
            <AnatomyScene system={system} selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to teach & learn anatomy</h2>
          <p className="mt-4 text-muted-foreground">From medical school to high school biology — one platform, every tool.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-glow transition-all">
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEMS STRIP */}
      <section className="container py-12">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-10 md:p-14">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">11 body systems. <span className="text-gradient">One viewer.</span></h2>
              <p className="text-muted-foreground mb-6">Switch between skeletal, muscular, nervous, cardiovascular, respiratory, digestive, urinary, reproductive, endocrine, lymphatic and integumentary systems with a single click.</p>
              <Button asChild variant="hero"><Link to="/atlas">Browse the atlas <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Skeletal","Muscular","Nervous","Cardio","Respiratory","Digestive","Urinary","Endocrine","Lymphatic"].map((s) => (
                <div key={s} className="aspect-square rounded-lg bg-background/60 border border-border grid place-items-center text-xs text-center p-2 hover:border-primary/40 hover:text-primary transition-colors">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-12 md:p-16 text-center text-primary-foreground">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start your free trial today</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Join over 2 million students and educators using Anatomia3D worldwide.</p>
            <Button asChild size="xl" variant="secondary"><Link to="/auth?mode=signup">Create free account <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
