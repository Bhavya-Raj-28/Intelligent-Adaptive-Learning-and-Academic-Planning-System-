function Footer() {
  return (
    <footer className="bg-slate-900 px-6 py-12 text-white md:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Main footer */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

          {/* Brand */}
          <div className="text-center md:text-left">

            <div className="flex items-center justify-center gap-3 md:justify-start">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-xl shadow-md">
                🎓
              </div>

              <h2 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-2xl font-extrabold text-transparent">
                EduAI
              </h2>

            </div>

            <p className="mt-3 text-sm text-slate-400">
              AI-Powered Personalized Learning Platform
            </p>

          </div>


          {/* Quick links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">

            <a
              href="#features"
              className="transition hover:text-cyan-400"
            >
              Features
            </a>

            <a
              href="#about"
              className="transition hover:text-cyan-400"
            >
              How It Works
            </a>

          </div>

        </div>


        {/* Divider */}
        <div className="my-8 h-px bg-slate-800" />


        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-slate-500 md:flex-row md:text-left">

          <p>
            © 2026 EduAI. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built for smarter learning
            <span className="text-emerald-400">✦</span>
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;