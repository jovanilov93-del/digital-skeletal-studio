import { Link } from "react-router-dom";
import { Bone, Brain, Heart, Layers, Wind, Soup, Droplets, Activity, Dna, Baby, Shirt } from "lucide-react";

const SYSTEMS = [
  {
    id: "skeletal",
    name: "Skeletal System",
    icon: Bone,
    count: 206,
    color: "from-amber-500/20 to-orange-500/10",
    desc: "Bones, joints, cartilage and ligaments forming the body's rigid framework and protecting vital organs.",
  },
  {
    id: "muscular",
    name: "Muscular System",
    icon: Layers,
    count: 650,
    color: "from-rose-500/20 to-red-500/10",
    desc: "Skeletal, smooth and cardiac muscle tissues enabling movement, posture and internal organ function.",
  },
  {
    id: "nervous",
    name: "Nervous System",
    icon: Brain,
    count: 86,
    color: "from-yellow-500/20 to-amber-500/10",
    desc: "Brain, spinal cord and peripheral nerves coordinating sensory input, motor output and cognition.",
  },
  {
    id: "circulatory",
    name: "Circulatory System",
    icon: Heart,
    count: 120,
    color: "from-red-500/20 to-pink-500/10",
    desc: "Heart, blood vessels and blood delivering oxygen, nutrients and hormones throughout the body.",
  },
  {
    id: "respiratory",
    name: "Respiratory System",
    icon: Wind,
    count: 32,
    color: "from-cyan-500/20 to-blue-500/10",
    desc: "Lungs, airways and diaphragm responsible for gas exchange between air and the bloodstream.",
  },
  {
    id: "digestive",
    name: "Digestive System",
    icon: Soup,
    count: 48,
    color: "from-emerald-500/20 to-green-500/10",
    desc: "Gastrointestinal tract and accessory organs that process food, absorb nutrients and eliminate waste.",
  },
  {
    id: "urinary",
    name: "Urinary System",
    icon: Droplets,
    count: 18,
    color: "from-blue-500/20 to-indigo-500/10",
    desc: "Kidneys, ureters, bladder and urethra that filter blood and regulate fluid and electrolyte balance.",
  },
  {
    id: "endocrine",
    name: "Endocrine System",
    icon: Activity,
    count: 24,
    color: "from-violet-500/20 to-purple-500/10",
    desc: "Glands secreting hormones that regulate metabolism, growth, mood and reproductive processes.",
  },
  {
    id: "lymphatic",
    name: "Lymphatic System",
    icon: Dna,
    count: 40,
    color: "from-teal-500/20 to-cyan-500/10",
    desc: "Vessels, nodes and organs that transport lymph, support immune defence and maintain fluid balance.",
  },
  {
    id: "reproductive",
    name: "Reproductive System",
    icon: Baby,
    count: 26,
    color: "from-pink-500/20 to-fuchsia-500/10",
    desc: "Organs and structures involved in the production of gametes and support of reproduction.",
  },
  {
    id: "integumentary",
    name: "Integumentary System",
    icon: Shirt,
    count: 7,
    color: "from-orange-500/20 to-yellow-500/10",
    desc: "Skin, hair, nails and glands forming the body's outer protective barrier and sensory interface.",
  },
];

const AtlasPage = () => (
  <div className="container py-14">
    <div className="max-w-2xl mb-12">
      <div className="inline-block text-xs uppercase text-primary tracking-wide font-semibold mb-2">
        Anatomical Atlas
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-3">Browse every body system</h1>
      <p className="text-muted-foreground">
        Choose a system to explore its structures in 3D. Rotate, zoom and pan the model freely — click any part to identify it.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SYSTEMS.map((s) => (
        <Link
          key={s.id}
          to={`/viewer?system=${s.id}`}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-elegant transition-all"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`}
          />
          <div className="relative">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4 group-hover:scale-110 transition-transform">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{s.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.count} structures</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform">
                Explore in 3D →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default AtlasPage;
