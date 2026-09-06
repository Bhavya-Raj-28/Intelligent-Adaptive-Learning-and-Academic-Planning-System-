import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/register", form);

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />

      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2">

          {/* Left side */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-10 text-white md:flex md:flex-col md:justify-between">

            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            {/* Logo */}
            <div className="relative">

              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl shadow-md backdrop-blur-sm">
                  🎓
                </div>

                <span className="text-2xl font-extrabold">
                  EduAI
                </span>
              </Link>

            </div>


            {/* Main message */}
            <div className="relative">

              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                Start your journey
              </p>

              <h1 className="text-4xl font-extrabold leading-tight">
                Your smarter
                <br />
                learning journey starts here.
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-white/80">
                Create your account and get access to personalized
                study plans, adaptive quizzes, AI tutoring, and
                progress tracking.
              </p>

            </div>


            {/* Feature highlight */}
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow">
                  ✨
                </div>

                <div>
                  <p className="text-sm text-white/70">
                    Personalized for you
                  </p>

                  <p className="mt-1 font-bold">
                    Learn smarter. Grow faster.
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* Right side */}
          <div className="p-7 sm:p-10 md:p-12">

            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-8 flex items-center justify-center gap-2 md:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-lg text-white shadow-md">
                🎓
              </div>

              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-2xl font-extrabold text-transparent">
                EduAI
              </span>
            </Link>


            {/* Registration form */}
            <div>

              <div className="mb-7">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                  🚀
                </div>

                <h1 className="text-3xl font-extrabold text-slate-800">
                  Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Join EduAI and start your personalized learning journey.
                </p>

              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Password */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Register button */}
                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Create Account →
                </button>

              </form>


              {/* Login link */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
                  ALREADY REGISTERED?
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>


              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-blue-600 transition hover:text-emerald-500"
                >
                  Login
                </Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;