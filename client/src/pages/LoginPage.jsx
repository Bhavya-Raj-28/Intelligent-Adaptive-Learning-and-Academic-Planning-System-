import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userId = res.data.user.id;

      console.log("Logged in User ID:", userId);

      // Check whether student has completed onboarding
      try {
        await API.get(`/profile/${userId}`);

        // Profile exists
        console.log("Student profile exists");

        alert("Login Successful!");

        navigate("/dashboard");
      } catch (profileError) {
        if (profileError.response?.status === 404) {
          // Profile does not exist
          console.log("No student profile found");

          alert("Please complete your student profile.");

          navigate("/onboarding");
        } else {
          throw profileError;
        }
      }
    } catch (err) {
      console.log(err);
      console.log("Response:", err.response);
      console.log("Message:", err.message);

      alert(err.response?.data?.message || "Login failed");
    }
  }

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


            <div className="relative">

              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                Welcome back
              </p>

              <h1 className="text-4xl font-extrabold leading-tight">
                Continue your
                <br />
                learning journey.
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-white/80">
                Access your personalized study plans, AI tutor,
                adaptive quizzes, and learning analytics.
              </p>

            </div>


            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow">
                  🤖
                </div>

                <div>
                  <p className="text-sm text-white/70">
                    Your AI Learning Companion
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


            <Card className="border-0 bg-transparent shadow-none">

              <CardHeader className="px-0 pb-6">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  👋
                </div>

                <CardTitle className="text-3xl font-extrabold text-slate-800">
                  Welcome Back
                </CardTitle>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to continue your personalized learning experience.
                </p>

              </CardHeader>


              <CardContent className="px-0">

                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <Input
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <Input
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>


                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Login →
                  </Button>

                </form>


                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">
                    NEW TO EDUAI?
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>


                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 transition hover:text-emerald-500"
                  >
                    Create an account
                  </Link>
                </p>

              </CardContent>

            </Card>

          </div>

        </div>

      </div>

    </div>
  );
}