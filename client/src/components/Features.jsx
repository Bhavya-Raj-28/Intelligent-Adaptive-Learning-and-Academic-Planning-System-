function Features() {
  const features = [
    {
      title: "🤖 AI Tutor",
      description: "Get instant explanations and personalized learning support.",
    },
    {
      title: "📝 Adaptive Quiz",
      description: "AI adjusts question difficulty based on your performance.",
    },
    {
      title: "📅 Study Planner",
      description: "Automatically generate study schedules based on your goals.",
    },
    {
      title: "📊 Progress Analytics",
      description: "Track learning progress with detailed insights and reports.",
    },
  ];

  return (
    <section id="features" className="bg-slate-950 text-white py-20 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">
        Our Features
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition"
          >
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;