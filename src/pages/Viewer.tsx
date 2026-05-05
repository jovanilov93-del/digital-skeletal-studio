import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnatomyScene, AnatomySceneHandle } from "@/components/anatomy/AnatomyScene";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Bone, Brain, Heart, Layers, Wind, Soup, Droplets,
  Activity, Dna, Baby, Shirt,
  Search, RotateCcw, Eye, EyeOff, Info,
  ZoomIn, ZoomOut, Move,
} from "lucide-react";

const SYSTEMS = [
  { id: "skeletal",      label: "Skeletal",      icon: Bone,     count: 206 },
  { id: "muscular",      label: "Muscular",       icon: Layers,   count: 650 },
  { id: "nervous",       label: "Nervous",        icon: Brain,    count: 86  },
  { id: "circulatory",   label: "Circulatory",    icon: Heart,    count: 120 },
  { id: "respiratory",   label: "Respiratory",    icon: Wind,     count: 32  },
  { id: "digestive",     label: "Digestive",      icon: Soup,     count: 48  },
  { id: "urinary",       label: "Urinary",        icon: Droplets, count: 18  },
  { id: "endocrine",     label: "Endocrine",      icon: Activity, count: 24  },
  { id: "lymphatic",     label: "Lymphatic",      icon: Dna,      count: 40  },
  { id: "reproductive",  label: "Reproductive",   icon: Baby,     count: 26  },
  { id: "integumentary", label: "Integumentary",  icon: Shirt,    count: 7   },
];

const ViewerPage = () => {
  const [searchParams] = useSearchParams();
  const initialSystem = searchParams.get("system") ?? "muscular";
  const validInitial = SYSTEMS.some((s) => s.id === initialSystem) ? initialSystem : "muscular";

  const [system, setSystem]       = useState(validInitial);
  const [selected, setSelected]   = useState<string | null>(null);
  const [opacity, setOpacity]     = useState([85]);
  const [showLabels, setShowLabels] = useState(true);
  const [search, setSearch]       = useState("");

  const sceneRef = useRef<AnatomySceneHandle>(null);

  const filteredSystems = SYSTEMS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSystemChange = (id: string) => {
    setSystem(id);
    setSelected(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">

      {/* ── Left sidebar ── */}
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card/40 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search systems…"
              className="w-full h-9 pl-9 pr-3 rounded-md bg-secondary text-sm border border-border focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-2">
            Body systems
          </p>
          <div className="space-y-0.5">
            {filteredSystems.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSystemChange(s.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  system === s.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <s.icon className="h-4 w-4 shrink-0" />
                  {s.label}
                </span>
                <span className="text-xs opacity-50">{s.count}</span>
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 mt-6 px-2">
            Display
          </p>
          <div className="px-2 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Opacity</span>
                <span>{opacity[0]}%</span>
              </div>
              <Slider value={opacity} onValueChange={setOpacity} max={100} step={5} />
            </div>
            <Button
              variant={showLabels ? "glow" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowLabels(!showLabels)}
            >
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {showLabels ? "Labels on" : "Labels off"}
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Canvas ── */}
      <div className="flex-1 relative bg-gradient-hero min-h-0">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

        <AnatomyScene
          ref={sceneRef}
          system={system}
          selected={selected}
          onSelect={setSelected}
          opacity={opacity[0] / 100}
          showLabels={showLabels}
        />

        {/* Camera controls overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="glow"
            title="Zoom in"
            onClick={() => sceneRef.current?.zoomIn()}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="glow"
            title="Zoom out"
            onClick={() => sceneRef.current?.zoomOut()}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="glow"
            title="Reset camera"
            onClick={() => {
              sceneRef.current?.resetCamera();
              setSelected(null);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Interaction hints */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border pointer-events-none">
          <span className="flex items-center gap-1"><Move className="h-3 w-3" /> Drag to rotate</span>
          <span>· Right-drag / two-finger to pan</span>
          <span>· Scroll to zoom</span>
          {selected && <span className="text-primary">· Selected: {selected}</span>}
        </div>
      </div>

      {/* ── Info panel ── */}
      <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-border bg-card/40 p-5 overflow-y-auto">
        {selected ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-primary uppercase tracking-wide font-semibold mb-1">
                {SYSTEMS.find((s) => s.id === system)?.label} system
              </div>
              <h2 className="text-xl font-bold break-words">{selected}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click different parts of the model to explore structures. Use the opacity slider to see through layers.
            </p>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelected(null)}>
              Clear selection
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <Info className="h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm font-medium mb-1">
              {SYSTEMS.find((s) => s.id === system)?.label} System
            </p>
            <p className="text-xs leading-relaxed opacity-70">
              Click any part of the model to select it. Use the controls on the right to zoom and reset the view.
            </p>
            <div className="mt-6 text-left w-full space-y-2 text-xs">
              <p className="font-semibold text-foreground mb-2">Controls</p>
              <div className="flex justify-between"><span className="opacity-60">Rotate</span><span>Left drag</span></div>
              <div className="flex justify-between"><span className="opacity-60">Pan</span><span>Right drag</span></div>
              <div className="flex justify-between"><span className="opacity-60">Zoom</span><span>Scroll wheel</span></div>
              <div className="flex justify-between"><span className="opacity-60">Reset view</span><span>↺ button</span></div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ViewerPage;
