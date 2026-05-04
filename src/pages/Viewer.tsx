import { useState } from "react";
import { AnatomyScene } from "@/components/anatomy/AnatomyScene";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Bone, Brain, Heart, Layers, Wind, Soup, Droplets, Search, RotateCcw, Maximize, Eye, EyeOff, Info } from "lucide-react";

const SYSTEMS = [
  { id: "skeletal", label: "Skeletal", icon: Bone, count: 206 },
  { id: "muscular", label: "Muscular", icon: Layers, count: 650 },
  { id: "nervous", label: "Nervous", icon: Brain, count: 86 },
  { id: "circulatory", label: "Circulatory", icon: Heart, count: 120 },
  { id: "respiratory", label: "Respiratory", icon: Wind, count: 32 },
  { id: "digestive", label: "Digestive", icon: Soup, count: 48 },
  { id: "urinary", label: "Urinary", icon: Droplets, count: 18 },
];

const STRUCTURE_INFO: Record<string, { name: string; latin: string; system: string; desc: string }> = {
  brain: { name: "Brain", latin: "Encephalon", system: "Nervous", desc: "The central organ of the nervous system, controlling thought, memory, emotion, motor skills and every process that regulates the body." },
  heart: { name: "Heart", latin: "Cor", system: "Circulatory", desc: "A muscular organ that pumps blood through the circulatory system via rhythmic contractions, supplying oxygen and nutrients to tissues." },
  lungs: { name: "Lungs", latin: "Pulmones", system: "Respiratory", desc: "Paired spongy organs responsible for gas exchange between inhaled air and the bloodstream." },
  liver: { name: "Liver", latin: "Hepar", system: "Digestive", desc: "The largest internal organ, performing detoxification, protein synthesis and production of bile." },
  femur: { name: "Femur", latin: "Os femoris", system: "Skeletal", desc: "The longest, strongest bone in the human body, forming the thigh and articulating with the hip and knee." },
};

const ViewerPage = () => {
  const [system, setSystem] = useState("muscular");
  const [selected, setSelected] = useState<string | null>(null);
  const [opacity, setOpacity] = useState([85]);
  const [showLabels, setShowLabels] = useState(true);
  const info = selected ? STRUCTURE_INFO[selected] : null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Left sidebar */}
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card/40 p-4 overflow-y-auto">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search structures..." className="w-full h-9 pl-9 pr-3 rounded-md bg-secondary text-sm border border-border focus:border-primary outline-none" />
        </div>
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-2">Body systems</h3>
        <div className="space-y-1">
          {SYSTEMS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSystem(s.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                system === s.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2"><s.icon className="h-4 w-4" /> {s.label}</span>
              <span className="text-xs opacity-60">{s.count}</span>
            </button>
          ))}
        </div>

        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2 mt-6 px-2">Display</h3>
        <div className="px-2 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2"><span className="text-muted-foreground">Tissue opacity</span><span>{opacity[0]}%</span></div>
            <Slider value={opacity} onValueChange={setOpacity} max={100} step={5} />
          </div>
          <Button variant={showLabels ? "glow" : "ghost"} size="sm" className="w-full justify-start" onClick={() => setShowLabels(!showLabels)}>
            {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} {showLabels ? "Labels on" : "Labels off"}
          </Button>
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1 relative bg-gradient-hero">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <AnatomyScene system={system} selected={selected} onSelect={setSelected} />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="glow" onClick={() => setSelected(null)}><RotateCcw className="h-4 w-4" /></Button>
          <Button size="icon" variant="glow"><Maximize className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Info panel */}
      <aside className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card/40 p-5 overflow-y-auto">
        {info ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-primary uppercase tracking-wide font-semibold mb-1">{info.system} system</div>
              <h2 className="text-2xl font-bold">{info.name}</h2>
              <p className="text-sm text-muted-foreground italic">{info.latin}</p>
            </div>
            <div className="aspect-video rounded-lg bg-gradient-primary/20 border border-border grid place-items-center text-xs text-muted-foreground">
              Reference imagery
            </div>
            <p className="text-sm leading-relaxed">{info.desc}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="glow" size="sm">View lesson</Button>
              <Button variant="ghost" size="sm">Take quiz</Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
            <Info className="h-8 w-8 mb-3 opacity-50" />
            <p className="text-sm">Click any glowing hotspot on the model to view structure details, related lessons and quizzes.</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ViewerPage;
