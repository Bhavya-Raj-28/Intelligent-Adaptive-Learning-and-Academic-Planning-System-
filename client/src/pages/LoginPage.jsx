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

    alert(
      err.response?.data?.message ||
      "Login failed"
    );
  }
}

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <Card className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400">

        <CardHeader>
          <CardTitle className="text-3xl">
            Welcome Back 👋
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleLogin} className="space-y-5">

            <Input
  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
  placeholder="Email"
  value={email}
  onChange={(e)=>setEmail(e.target.value)}
/>

            <Input
  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e)=>setPassword(e.target.value)}
/>

            <Button type="submit" className="w-full">
  Login
</Button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400"
            >
              Register
            </Link>
          </p>

        </CardContent>

      </Card>

    </div>
  );
}