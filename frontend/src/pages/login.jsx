import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { loginUser } from "../services/authService";
import bgImage from "../assets/backgound.png";
import { getOnboarding } from "../services/onboardingService";
import { Mail } from "lucide-react";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const handleGoogleLogin = () => {
    const supabaseUrl = "https://okxwojwwlphqrhcqfbuy.supabase.co";
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
  };

  const handleAppleLogin = () => {
    const supabaseUrl = "https://okxwojwwlphqrhcqfbuy.supabase.co";
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=apple&redirect_to=${redirectUrl}`;
  };

  const handleEmailClick = () => {
    emailInputRef.current?.focus();
  };

  const handleForgotPassword = async () => {
    const emailInput = prompt("Please enter your email to receive a password reset link:");
    if (!emailInput) return;
    
    if (!emailInput.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await api.post("/auth/forgot-password", { email: emailInput });
      if (response.data.success) {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to send password reset email.");
    }
  };

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
              ref={emailInputRef}
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
              onClick={handleForgotPassword}
              className="text-purple-500 text-sm hover:underline cursor-pointer"
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
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-14 h-14 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl flex items-center justify-center transition shadow-sm cursor-pointer"
            title="Continue with Google"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="w-14 h-14 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl flex items-center justify-center transition shadow-sm cursor-pointer"
            title="Continue with Apple"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-slate-800">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.62.71-1.16 1.85-1.01 2.96 1.11.09 2.25-.56 2.96-1.41z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleEmailClick}
            className="w-14 h-14 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl flex items-center justify-center transition shadow-sm cursor-pointer text-gray-500 hover:text-gray-750"
            title="Continue with Email"
          >
            <Mail className="w-6 h-6" />
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