import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-xl text-white shadow-md">
            🎓
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              EduAI
            </h1>

            <p className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">
              LEARN • GROW • ACHIEVE
            </p>
          </div>
        </Link>


        {/* Navigation */}
        <div className="flex items-center gap-5 text-sm font-medium md:gap-8">

          <Link
            to="/"
            className="text-slate-600 transition hover:text-blue-600"
          >
            Home
          </Link>

          <a
            href="#features"
            className="hidden text-slate-600 transition hover:text-blue-600 sm:block"
          >
            Features
          </a>

          <a
            href="#about"
            className="hidden text-slate-600 transition hover:text-blue-600 sm:block"
          >
            About
          </a>

          <Link
            to="/login"
            className="rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-5 py-2.5 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Login →
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;