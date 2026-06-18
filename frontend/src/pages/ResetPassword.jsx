import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/backgound.png";
import api from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase redirects resets back to the app with `#access_token=...`
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setToken(accessToken);
      }
    } else {
      setError("Invalid or expired password reset link. Please trigger a new one.");
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      alert("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!token) {
      alert("Missing authorization token. Please click the email link again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        // Clear tokens from URL
        window.history.replaceState(null, "", window.location.pathname);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-black tracking-widest text-slate-800 uppercase mt-2">
            Reset Password
          </h1>
          <p className="text-gray-500 text-center text-xs mt-3">
            Enter your new secure password below to regain access to your account.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center text-green-700 space-y-2">
            <p className="font-bold text-sm">Password Updated Successfully! 🎉</p>
            <p className="text-xs">Redirecting you to the sign-in screen...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-sm font-medium"
                required
                disabled={loading || !token}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-sm font-medium"
                required
                disabled={loading || !token}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-purple-500 to-pink-400 hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-md text-sm"
            >
              {loading ? "Updating Password..." : "Update Password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
