import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function ProfileSyncStatus({ isSynced }) {
  if (isSynced) {
    return (
      <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-emerald-800 text-xs font-semibold max-w-max shadow-sm">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>Profile synced successfully with server</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-amber-800 text-xs font-semibold max-w-xl shadow-sm">
      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
      <div>
        <span className="block sm:inline font-bold">Unable to sync latest profile.</span>{" "}
        <span className="text-amber-700">Showing locally cached onboarding data.</span>
      </div>
    </div>
  );
}
