import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white flex justify-between items-center px-10 py-5 border-b border-slate-700 sticky top-0 z-50">

      <h1 className="text-3xl font-bold text-indigo-400">
        EduAI
      </h1>

      <div className="flex gap-8 text-slate-300">

        <Link to="/" className="hover:text-indigo-400 transition">
          Home
        </Link>

        <a href="#features" className="hover:text-indigo-400 transition">
          Features
        </a>

        <a href="#about" className="hover:text-indigo-400 transition">
          About
        </a>

        <Link to="/login" className="hover:text-indigo-400 transition">
          Login
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;