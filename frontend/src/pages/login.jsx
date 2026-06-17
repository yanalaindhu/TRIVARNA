import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();

const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser({
  email: formData.email,
  password: formData.password,
});

localStorage.setItem(
  "token",
  response.access_token
);

console.log("Login Success", response);

navigate("/dashboard");

   

  } catch (error) {
    console.error(error);
    alert("Invalid email or password");
  }
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            🧠
          </div>

          <div>
            <h1 className="font-bold text-xl">
              TRIVARNA
            </h1>

            <p className="text-sm text-gray-500">
              Mind • Body • Lifestyle
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800">
          Welcome Back
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Continue your growth journey.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border rounded-xl p-3"
            />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-xl p-3"
            />

            <button
        type="submit"
        className="
            w-full
            py-3
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-indigo-500
            text-white
            font-semibold
        "
        >
        Sign In
        </button>

        </form>

        <p className="mt-6 text-center text-gray-500">
          Don't have an account?

          <Link
            to="/signup"
            className="text-purple-600 font-semibold ml-2"
          >
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}