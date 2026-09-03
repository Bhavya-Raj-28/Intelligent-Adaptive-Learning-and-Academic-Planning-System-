function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up and choose your subjects and semester.",
    },
    {
      number: "02",
      title: "AI Understands You",
      description: "Our AI analyzes your goals and learning preferences.",
    },
    {
      number: "03",
      title: "Start Learning",
      description: "Receive personalized study plans and adaptive quizzes.",
    },
  ];

  return (
    <section
      id="about"
      className="bg-slate-900 text-white py-20 px-8"
    >
      <h2 className="text-4xl font-bold text-center mb-12">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-indigo-500 transition"
          >
            <p className="text-indigo-400 text-5xl font-bold">
              {step.number}
            </p>

            <h3 className="text-2xl font-semibold mt-5">
              {step.title}
            </h3>

            <p className="text-slate-400 mt-4">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;