import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "../pages/home";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Onboarding from "../pages/onboarding/Onboarding";
import Chatbot from "../features/chatbot/Chatbot";
import MindOverview from "../pages/mind";
import BodyOverview from "../pages/body";
import LifeOverview from "../pages/life";
import GoalsPage from "../pages/goals";
import HabitsPage from "../pages/habits";
import HealthTwin from "../pages/healthtwin";
import ReportsPage from "../pages/reports";
import Settings from "../pages/settings";
import Profile from "../pages/profile";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/dashboard";
import ResetPassword from "../pages/ResetPassword";

export default function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      // Ignore intercepting if the user is explicitly on the reset password screen
      if (window.location.pathname === "/reset-password") {
        return;
      }

      try {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }
          
          const payloadBase64 = accessToken.split(".")[1];
          const payloadDecoded = JSON.parse(atob(payloadBase64));
          
          localStorage.setItem("userId", payloadDecoded.sub);
          localStorage.setItem("email", payloadDecoded.email);
          
          // Clear hash in URL
          window.history.replaceState(null, "", window.location.pathname);
          
          // Navigate to dashboard
          navigate("/dashboard");
        }
      } catch (e) {
        console.error("Failed to parse OAuth tokens:", e);
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route
  path="/dashboard"
  element={<Dashboard />}
/>
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="/mind" element={<ProtectedRoute><MindOverview /></ProtectedRoute>} />
      <Route path="/body" element={<ProtectedRoute><BodyOverview /></ProtectedRoute>} />
      <Route path="/life" element={<ProtectedRoute><LifeOverview /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
      <Route path="/health-twin" element={<ProtectedRoute><HealthTwin /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}