# TRIVARNA Profile Page Feature

This folder contains a fully isolated, frontend-only implementation of the **TRIVARNA Profile Page** designed for zero-conflict integration.

## Purpose

The Profile page aggregates the user's wellness metrics, AI assessment scores (Mind, Body, Lifestyle, Overall), dynamic achievements/badges, 6-month vision objectives, and an AI-generated daily schedule plan.

## Folder Structure

```text
src/features/profile/
├── components/
│   ├── AccountActions.jsx       # Read-only UI settings actions list
│   ├── AchievementBadges.jsx    # Dynamically calculated badges based on scores
│   ├── AIPlanPreview.jsx        # Daily schedule timeline split by Morning/Afternoon/Evening/Night
│   ├── GoalsOverview.jsx        # Selected goals chips, target, and vision text
│   ├── LifeBalanceChart.jsx     # Recharts Radar Chart mapping 8 wheel categories
│   ├── ProfileButton.jsx        # Reusable dashboard profile entry button
│   ├── ProfileHeader.jsx        # Top banner showing avatar, levels, and streaks
│   ├── ProfileSkeleton.jsx      # Shimmer skeleton loader card placeholders
│   └── ProfileSyncStatus.jsx    # Status header card reporting sync or cached state
├── constants/
│   ├── profileConfig.js         # Default fallback settings and values
│   └── routes.js                # Profile route constant definition
├── hooks/
│   └── useProfileData.js        # Main custom hook orchestrating fetch & Zustand fallback
├── services/
│   └── profileService.js        # Safe, non-crashing backend API fetch requests
├── store/
│   └── profileStore.js          # Isolated Zustand store tracking state
├── Profile.jsx                  # Main feature orchestrator and layout container
└── README.md                    # This description file
```

## Data Integration & Fallback Strategy

The profile uses a dual-source data pipeline:
1. **Backend Integration**: Attempt to query:
   - `GET /api/profile/{userId}`
   - `GET /api/dashboard/{userId}`
   - `GET /api/onboarding/profile/{userId}`
2. **Local Fallback**: If backend is unavailable or returns 404, the custom hook `useProfileData()` instantly falls back to values in `useOnboardingStore` (results, aiPlan, goals, balanceWheel, productiveWindow). If that is also empty, it utilizes pre-configured defaults from `profileConfig.js`.

## Styling & Theme

Aligned to TRIVARNA visual tokens:
- Primary Purple: `#6C4CF1`
- Secondary Purple: `#8B6CFF`
- Light Purple: `#F3F0FF`
- Glassmorphic panels, rounded borders, soft hover animations, and Framer Motion grid entrances.
