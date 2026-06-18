import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";
import bgImage from "../assets/backgound.png";
import { getOnboarding } from "../services/onboardingService";
export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      console.log("LOGIN RESPONSE:", response);
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("email", response.user.email);
      console.log("Login Success", response);
      const onboarding = await getOnboarding(response.user.id);

        if (onboarding.success) {
        navigate("/dashboard");
        } else {
        navigate("/onboarding");
        }
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div
        className="
          w-full
          max-w-[430px]
          bg-white/80
          backdrop-blur-xl
          border border-white/40
          rounded-[30px]
          shadow-2xl
          p-10
        "
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="Trivarna"
            className="w-24 h-24 object-contain"
          />

          <h1 className="text-4xl font-bold tracking-widest text-slate-800">
            TRIVARNA
          </h1>

          <p className="text-purple-500 text-sm mt-1">
            Mind • Body • Lifestyle
          </p>

          <p className="text-gray-500 text-center text-sm mt-4">
            Your AI Companion for a
            <br />
            Balanced & Better You
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-purple-500 text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-400 hover:opacity-90 transition"
          >
            Login →
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="text-center text-gray-500 text-sm mb-4">
          Continue with
        </div>

        <div className="flex justify-center gap-4">
          <button className="w-14 h-14 border rounded-xl">
            G
          </button>

          <button className="w-14 h-14 border rounded-xl">
            🍎
          </button>

          <button className="w-14 h-14 border rounded-xl">
            ✉️
          </button>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Don't have an account?

          <Link
            to="/signup"
            className="ml-2 text-purple-600 font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}