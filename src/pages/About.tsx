const AboutPage = () => (
  <div className="container py-20 max-w-3xl">
    <div className="text-xs uppercase text-primary tracking-wide font-semibold mb-2">About</div>
    <h1 className="text-4xl md:text-5xl font-bold mb-6">Anatomy education, reimagined</h1>
    <p className="text-lg text-muted-foreground mb-6">
      Anatomia3D is built by educators, clinicians and 3D artists with one mission: make the human body explorable, understandable and unforgettable.
    </p>
    <p className="text-muted-foreground mb-12">
      Used in medical schools, universities and clinics across more than 60 countries, our platform combines anatomically accurate 3D models with curated lessons, quizzes and immersive AR/VR experiences.
    </p>
    <div className="grid sm:grid-cols-3 gap-6">
      {[{ k: "60+", v: "Countries" }, { k: "12", v: "Languages" }, { k: "2M+", v: "Learners" }].map((s) => (
        <div key={s.v} className="p-6 rounded-xl border border-border bg-card">
          <div className="text-3xl font-bold text-gradient">{s.k}</div>
          <div className="text-sm text-muted-foreground mt-1">{s.v}</div>
        </div>
      ))}
    </div>
  </div>
);

export default AboutPage;
