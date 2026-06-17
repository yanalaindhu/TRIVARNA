import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";

export default function Signup() {
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

const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await signupUser({
      email: formData.email,
      password: formData.password,
    });

    console.log(response);

    navigate("/onboarding");
  } catch (error) {
  console.log("Backend Error:", error.response?.data);
  alert(JSON.stringify(error.response?.data));
}
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF] px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            🌸
          </div>

          <h1 className="font-semibold text-lg text-slate-800">
            Trivarna
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-slate-800">
          Create Account
        </h2>

        <p className="text-gray-500 text-sm mt-1 mb-6">
          Start your journey with TRIVARNA
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
        />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
         />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-purple-600
              to-indigo-500
              hover:opacity-95
              transition
            "
          >
            Sign Up
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">
            or continue with
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">

          <button className="w-12 h-12 border rounded-xl">
            G
          </button>

          <button className="w-12 h-12 border rounded-xl">
            🍎
          </button>

          <button className="w-12 h-12 border rounded-xl">
            ✉️
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8 text-sm">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-purple-600 font-semibold"
          >
            Sign In
          </Link>
        </p>

      </div>

    </div>
    
  );
}