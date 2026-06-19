import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../../components/sidebar";
import { useProfileData } from "./hooks/useProfileData";
import ProfileHeader from "./components/ProfileHeader";
import WellnessScoreCards from "./components/WellnessScoreCards";
import WellnessInsights from "./components/WellnessInsights";
import LifeBalanceChart from "./components/LifeBalanceChart";
import GoalsOverview from "./components/GoalsOverview";
import AIPlanPreview from "./components/AIPlanPreview";
import AchievementBadges from "./components/AchievementBadges";
import AccountActions from "./components/AccountActions";
import ProfileSyncStatus from "./components/ProfileSyncStatus";
import ProfileSkeleton from "./components/ProfileSkeleton";

// Motion variants for entrance animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const { profileData, loading, error, isSynced } = useProfileData();

  if (loading) {
    return <ProfileSkeleton />;
  }

  // Fallback fallback protection just in case profileData is somehow empty
  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-sm text-center space-y-4">
          <p className="text-gray-600">No profile configuration loaded.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-[#6C4CF1] text-white rounded-xl hover:bg-[#8B6CFF] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { user, scores, goals, aiPlan, balanceWheel, insights } = profileData;

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-[#6C4CF1] transition-colors duration-200 group self-start"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Dashboard</span>
          </button>
          
          <ProfileSyncStatus isSynced={isSynced} />
        </div>

        {/* Animated Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants}>
            <ProfileHeader user={user} />
          </motion.div>

          {/* Scores Overview Grid */}
          <motion.div variants={itemVariants}>
            <WellnessScoreCards scores={scores} />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Middle Column (2/3 width) - Insights, Goals & AI Schedule */}
            <div className="lg:col-span-2 space-y-6">
              
              <motion.div variants={itemVariants}>
                <WellnessInsights insights={insights} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <GoalsOverview goals={goals} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <AIPlanPreview aiPlan={aiPlan} />
              </motion.div>

            </div>

            {/* Right Column (1/3 width) - Radar Chart, Badges, settings */}
            <div className="space-y-6">
              
              <motion.div variants={itemVariants}>
                <LifeBalanceChart balanceWheel={balanceWheel} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <AchievementBadges scores={scores} insights={insights} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <AccountActions />
              </motion.div>

            </div>

          </div>

        </motion.div>
      </main>
    </div>
  );
}
