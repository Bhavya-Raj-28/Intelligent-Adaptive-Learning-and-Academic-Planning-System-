import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 px-6 text-white">

      {/* Decorative gradient circles */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute right-1/4 top-20 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />


      {/* Main Content */}
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center">

        <div className="grid w-full items-center gap-12 md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <span>✨</span>
              AI Powered Learning Platform
            </div>


            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">

              Learn Smarter.

              <br />

              <span className="text-white/80">
                Grow Faster.
              </span>

            </h1>


            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 md:text-xl">
              Personalized study plans, adaptive quizzes,
              an AI tutor, and real-time learning analytics —
              everything you need to learn better in one place.
            </p>


            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">

              <Button
                text="Get Started →"
                onClick={() => navigate("/login")}
              />

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                Explore Features
              </button>

            </div>


            {/* Small trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/75">

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  ✓
                </span>
                Personalized Learning
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  ✓
                </span>
                AI Powered
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  ✓
                </span>
                Track Progress
              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="relative hidden md:block">

            {/* Main illustration card */}
            <div className="relative mx-auto max-w-md">

              {/* Floating card 1 */}
              <div className="absolute -left-10 top-16 z-20 rounded-2xl border border-white/30 bg-white/15 px-5 py-4 shadow-xl backdrop-blur-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow">
                    🤖
                  </div>

                  <div>
                    <p className="text-xs text-white/70">
                      AI Tutor
                    </p>

                    <p className="font-bold">
                      Ask anything
                    </p>
                  </div>

                </div>

              </div>


              {/* Main dashboard preview */}
              <div className="rounded-[2rem] border border-white/30 bg-white/15 p-4 shadow-2xl backdrop-blur-md">

                <div className="rounded-[1.5rem] bg-white p-5 text-slate-800 shadow-xl">

                  {/* Fake top bar */}
                  <div className="flex items-center justify-between">

                    <div>
                      <div className="h-3 w-24 rounded-full bg-slate-200" />
                      <div className="mt-2 h-2 w-16 rounded-full bg-slate-100" />
                    </div>

                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400" />

                  </div>


                  {/* Progress */}
                  <div className="mt-7 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs text-slate-400">
                          Today's Progress
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          72%
                        </p>
                      </div>

                      <div className="text-3xl">
                        📈
                      </div>

                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">

                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />

                    </div>

                  </div>


                  {/* Learning cards */}
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-emerald-50 p-4">

                      <div className="text-xl">
                        🤖
                      </div>

                      <p className="mt-2 text-xs font-bold">
                        AI Tutor
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Learn & ask
                      </p>

                    </div>


                    <div className="rounded-2xl bg-blue-50 p-4">

                      <div className="text-xl">
                        📅
                      </div>

                      <p className="mt-2 text-xs font-bold">
                        Study Plan
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Stay organized
                      </p>

                    </div>


                    <div className="rounded-2xl bg-orange-50 p-4">

                      <div className="text-xl">
                        📝
                      </div>

                      <p className="mt-2 text-xs font-bold">
                        Quiz
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Test yourself
                      </p>

                    </div>


                    <div className="rounded-2xl bg-purple-50 p-4">

                      <div className="text-xl">
                        📊
                      </div>

                      <p className="mt-2 text-xs font-bold">
                        Progress
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Track growth
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* Floating card 2 */}
              <div className="absolute -bottom-8 -right-8 z-20 rounded-2xl border border-white/30 bg-white px-5 py-4 text-slate-800 shadow-xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-xl">
                    🎯
                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Current Goal
                    </p>

                    <p className="font-bold">
                      Keep learning!
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;