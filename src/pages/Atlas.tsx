import { Link } from "react-router-dom";
import { Bone, Brain, Heart, Layers, Wind, Soup, Droplets, Eye, Ear, Activity, Dna } from "lucide-react";

const SYSTEMS = [
  { id: "skeletal", name: "Skeletal System", icon: Bone, count: 206, color: "from-amber-500/20 to-orange-500/10", desc: "Bones, joints, cartilage and ligaments forming the body's framework." },
  { id: "muscular", name: "Muscular System", icon: Layers, count: 650, color: "from-rose-500/20 to-red-500/10", desc: "Skeletal, smooth and cardiac muscle tissues enabling movement." },
  { id: "nervous", name: "Nervous System", icon: Brain, count: 86, color: "from-yellow-500/20 to-amber-500/10", desc: "Brain, spinal cord and peripheral nerves coordinating body activity." },
  { id: "circulatory", name: "Circulatory System", icon: Heart, count: 120, color: "from-red-500/20 to-pink-500/10", desc: "Heart, blood and vessels delivering oxygen and nutrients." },
  { id: "respiratory", name: "Respiratory System", icon: Wind, count: 32, color: "from-cyan-500/20 to-blue-500/10", desc: "Lungs, airways and diaphragm responsible for breathing." },
  { id: "digestive", name: "Digestive System", icon: Soup, count: 48, color: "from-emerald-500/20 to-green-500/10", desc: "Gastrointestinal tract and accessory organs processing food." },
  { id: "urinary", name: "Urinary System", icon: Droplets, count: 18, color: "from-blue-500/20 to-indigo-500/10", desc: "Kidneys, ureters and bladder filtering blood and producing urine." },
  { id: "endocrine", name: "Endocrine System", icon: Activity, count: 24, color: "from-violet-500/20 to-purple-500/10", desc: "Glands secreting hormones that regulate body functions." },
  { id: "lymphatic", name: "Lymphatic System", icon: Dna, count: 40, color: "from-teal-500/20 to-cyan-500/10", desc: "Vessels and nodes transporting lymph and supporting immunity." },
  { id: "visual", name: "Visual System", icon: Eye, count: 22, color: "from-sky-500/20 to-blue-500/10", desc: "Eyes and visual pathways transducing light into perception." },
  { id: "auditory", name: "Auditory System", icon: Ear, count: 18, color: "from-fuchsia-500/20 to-pink-500/10", desc: "Outer, middle and inner ear processing sound and balance." },
];

const AtlasPage = () => (
  <div className="container py-14">
    <div className="max-w-2xl mb-12">
      <div className="inline-block text-xs uppercase text-primary tracking-wide font-semibold mb-2">Anatomical Atlas</div>
      <h1 className="text-4xl md:text-5xl font-bold mb-3">Browse every body system</h1>
      <p className="text-muted-foreground">Choose a system to explore its structures in 3D, view labelled diagrams, study relationships and access curated lessons.</p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SYSTEMS.map((s) => (
        <Link
          key={s.id}
          to="/viewer"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-elegant transition-all"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="relative">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4 group-hover:scale-110 transition-transform">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{s.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.count} structures</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform">Explore →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default AtlasPage;
