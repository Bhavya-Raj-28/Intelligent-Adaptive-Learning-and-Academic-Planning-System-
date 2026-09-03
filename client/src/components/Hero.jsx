import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();
  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-slate-900 text-white px-6">
      <div className="max-w-4xl text-center">

        <p className="text-cyan-400 font-semibold uppercase tracking-widest mb-4">
          AI Powered Learning Platform
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Learn Smarter with{" "}
          <span className="text-indigo-500">
            Artificial Intelligence
          </span>
        </h1>

        <p className="mt-6 text-slate-300 text-lg md:text-xl">
          Personalized study plans, adaptive quizzes,
          AI tutor, and real-time learning analytics —
          all in one platform.
        </p>

        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          <Button
  text="Get Started"
  onClick={() => navigate("/login")}
/>
          <Button text="Learn More" />
        </div>

      </div>
    </section>
  );
}

export default Hero;