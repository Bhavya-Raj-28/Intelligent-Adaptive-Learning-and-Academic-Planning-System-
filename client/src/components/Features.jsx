function Features() {
  const features = [
    {
      title: "AI Tutor",
      icon: "🤖",
      description:
        "Get instant explanations and personalized learning support.",
      gradient: "from-emerald-50 to-cyan-50",
      iconGradient: "from-emerald-400 to-cyan-500",
      accent: "text-emerald-600",
    },
    {
      title: "Adaptive Quiz",
      icon: "📝",
      description:
        "AI adjusts question difficulty based on your performance.",
      gradient: "from-orange-50 to-amber-50",
      iconGradient: "from-orange-400 to-amber-500",
      accent: "text-orange-600",
    },
    {
      title: "Study Planner",
      icon: "📅",
      description:
        "Automatically generate study schedules based on your goals.",
      gradient: "from-blue-50 to-sky-100",
      iconGradient: "from-blue-500 to-cyan-500",
      accent: "text-blue-600",
    },
    {
      title: "Progress Analytics",
      icon: "📊",
      description:
        "Track learning progress with detailed insights and reports.",
      gradient: "from-purple-50 to-indigo-50",
      iconGradient: "from-purple-500 to-indigo-500",
      accent: "text-purple-600",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 px-6 py-24 md:px-10"
    >

      {/* Decorative background */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Everything you need to learn better
          </span>

          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
            Learning made
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              {" "}smarter
            </span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 md:text-lg">
            One platform that helps you understand concepts,
            stay organized, practice effectively, and track your growth.
          </p>

        </div>


        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl border border-white bg-gradient-to-br ${feature.gradient} p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >

              {/* Top accent */}
              <div
                className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${feature.iconGradient}`}
              />


              {/* Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.iconGradient} text-2xl shadow-md transition duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>


              {/* Content */}
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                {feature.title}
              </h3>

              <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                {feature.description}
              </p>


              {/* Learn more */}
              <div
                className={`mt-5 flex items-center gap-2 text-sm font-bold ${feature.accent}`}
              >
                Explore feature
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </div>

            </div>
          ))}

        </div>


        {/* Bottom highlight */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 p-8 text-white shadow-lg md:p-10">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                Built for students
              </p>

              <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                Study smarter, one step at a time. ✨
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
                Your learning journey, organized and personalized
                around the way you study.
              </p>

            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-4xl shadow-inner backdrop-blur-sm">
              🎓
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Features;