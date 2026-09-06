function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "👤",
      title: "Create Your Account",
      description: "Sign up and choose your subjects and semester.",
      gradient: "from-blue-500 to-cyan-500",
      bg: "from-blue-50 to-cyan-50",
    },
    {
      number: "02",
      icon: "🧠",
      title: "AI Understands You",
      description: "Our AI analyzes your goals and learning preferences.",
      gradient: "from-cyan-500 to-emerald-400",
      bg: "from-cyan-50 to-emerald-50",
    },
    {
      number: "03",
      icon: "🚀",
      title: "Start Learning",
      description:
        "Receive personalized study plans and adaptive quizzes.",
      gradient: "from-emerald-400 to-teal-500",
      bg: "from-emerald-50 to-teal-50",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white px-6 py-24 md:px-10"
    >
      {/* Decorative background */}
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">

          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-600">
            Simple. Personal. Intelligent.
          </span>

          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
            How it
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              {" "}works
            </span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 md:text-lg">
            Get started in just three simple steps and let AI
            personalize your learning journey.
          </p>

        </div>


        {/* Steps */}
        <div className="relative">

          {/* Connecting line */}
          <div className="absolute left-[16.5%] right-[16.5%] top-16 hidden h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200 md:block" />

          <div className="grid gap-8 md:grid-cols-3">

            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative text-center"
              >

                {/* Number / Icon */}
                <div className="relative z-10 mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg ring-8 ring-slate-50 transition duration-300 group-hover:-translate-y-2">

                  <div
                    className={`flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white shadow-md`}
                  >
                    <span className="text-2xl">
                      {step.icon}
                    </span>

                    <span className="mt-1 text-xs font-bold tracking-widest text-white/80">
                      {step.number}
                    </span>
                  </div>

                </div>


                {/* Content card */}
                <div
                  className={`mt-8 rounded-3xl border border-white bg-gradient-to-br ${step.bg} p-7 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
                >

                  <h3 className="text-xl font-bold text-slate-800">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>


        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 p-8 text-center text-white shadow-lg md:p-10">

          <div className="mx-auto max-w-2xl">

            <p className="text-3xl font-extrabold">
              Ready to learn smarter? 🎓
            </p>

            <p className="mt-3 text-sm leading-6 text-white/80 md:text-base">
              Let AI create a learning experience designed around you.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;