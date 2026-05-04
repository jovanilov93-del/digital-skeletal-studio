import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Bone, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";

const QUIZZES = [
  { id: "skeletal-basics", title: "Skeletal System Basics", icon: Bone, level: "Beginner", questions: 15, time: 10 },
  { id: "cardiac-anatomy", title: "Cardiac Anatomy", icon: Heart, level: "Intermediate", questions: 20, time: 15 },
  { id: "neuroanatomy", title: "Neuroanatomy 101", icon: Brain, level: "Advanced", questions: 25, time: 20 },
];

const SAMPLE_Q = {
  question: "Which chamber of the heart pumps oxygenated blood into systemic circulation?",
  options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
  correct: 3,
};

const QuizzesPage = () => {
  const [active, setActive] = useState<string | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  if (active) {
    return (
      <div className="container max-w-2xl py-14">
        <button onClick={() => { setActive(null); setPicked(null); }} className="text-sm text-muted-foreground hover:text-foreground mb-6">← Back to quizzes</button>
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
            <span>Question 1 of 15</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 9:42</span>
          </div>
          <h2 className="text-xl font-semibold mb-6">{SAMPLE_Q.question}</h2>
          <div className="space-y-2">
            {SAMPLE_Q.options.map((opt, i) => {
              const isCorrect = picked !== null && i === SAMPLE_Q.correct;
              const isWrong = picked === i && i !== SAMPLE_Q.correct;
              return (
                <button
                  key={i}
                  disabled={picked !== null}
                  onClick={() => setPicked(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                    isCorrect ? "border-primary bg-primary/10 text-primary" :
                    isWrong ? "border-destructive bg-destructive/10 text-destructive" :
                    "border-border hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  {opt}
                  {isCorrect && <CheckCircle2 className="h-5 w-5" />}
                  {isWrong && <XCircle className="h-5 w-5" />}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <Button variant="hero" className="w-full mt-6" onClick={() => setPicked(null)}>Next question</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-14">
      <div className="mb-12">
        <div className="text-xs uppercase text-primary tracking-wide font-semibold mb-2">Anatomy quizzes</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Test your knowledge</h1>
        <p className="text-muted-foreground max-w-xl">Self-paced quizzes across every body system. Track your progress and earn badges.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {[
          { label: "Quizzes taken", value: "0", icon: Trophy },
          { label: "Average score", value: "—", icon: CheckCircle2 },
          { label: "Time studied", value: "0 min", icon: Clock },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center"><s.icon className="h-5 w-5" /></div>
            <div><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {QUIZZES.map((q) => (
          <div key={q.id} className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-elegant transition-all">
            <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4"><q.icon className="h-5 w-5" /></div>
            <div className="text-xs text-primary mb-1">{q.level}</div>
            <h3 className="text-lg font-semibold mb-3">{q.title}</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
              <span>{q.questions} questions</span>
              <span>~{q.time} min</span>
            </div>
            <Button variant="glow" className="w-full" onClick={() => setActive(q.id)}>Start quiz</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzesPage;
