import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Onboarding from "../pages/onboarding/Onboarding";
import Chatbot from "../features/chatbot/Chatbot";
import MindOverview from "../pages/mind";
import BodyOverview from "../pages/body";
import SoulOverview from "../pages/soul";
import GoalsPage from "../pages/goals";
import HabitsPage from "../pages/habits";
import HealthTwin from "../pages/healthtwin";
import ReportsPage from "../pages/reports";
import Settings from "../pages/settings";
import Profile from "../pages/profile";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route
  path="/dashboard"
  element={<Dashboard />}
/>
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="/mind" element={<ProtectedRoute><MindOverview /></ProtectedRoute>} />
      <Route path="/body" element={<ProtectedRoute><BodyOverview /></ProtectedRoute>} />
      <Route path="/soul" element={<ProtectedRoute><SoulOverview /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
      <Route path="/health-twin" element={<ProtectedRoute><HealthTwin /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}