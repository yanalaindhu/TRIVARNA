# TRIVARNA Profile Page Documentation

- **Route Path**: `/profile` (defined as `PROFILE_ROUTE` in `routes.js`)
- **Vite Path**: [Profile.jsx](file:///c:/Users/bsais/OneDrive/Desktop/aiml-ds/week%2022/project/frontend/src/features/profile/Profile.jsx)

## Architecture & Design Purpose

The Profile Page is a self-contained feature module (`src/features/profile/*`) designed with a strict isolation boundary to prevent merge conflicts. It displays user information, wellness scores, AI coach narratives, a life balance wheel, selected goals, and daily schedule architectures.

## Folder Structure

The feature files are organized in the folder: `src/features/profile/`

```text
profile/
├── components/
│   ├── AccountActions.jsx       # Interactive settings buttons
│   ├── AchievementBadges.jsx    # Score-based dynamic badges
│   ├── AIPlanPreview.jsx        # Morning/Afternoon/Evening/Night schedule
│   ├── GoalsOverview.jsx        # Goal tags and 6-month vision
│   ├── LifeBalanceChart.jsx     # Recharts Radar Chart
│   ├── ProfileButton.jsx        # Navigation shortcut button
│   ├── ProfileHeader.jsx        # Basic profile bio & level stats
│   ├── ProfileSkeleton.jsx      # Shimmer skeleton loader
│   └── ProfileSyncStatus.jsx    # Status notification card
├── constants/
│   ├── profileConfig.js         # Default fallback settings
│   └── routes.js                # Route path constant
├── hooks/
│   └── useProfileData.js        # State orchestration hook
├── services/
│   └── profileService.js        # Safe API calls returning null on failure
├── store/
│   └── profileStore.js          # Independent Zustand store
└── Profile.jsx                  # Main feature container
```

## Data Flow & Props-Only Coupling

To decouple the UI layer from Zustand and backend schemas:
1. **Container-Child Architecture**: `Profile.jsx` is the only component that executes the state hook `useProfileData()`.
2. **Prop-Based Rendering**: All child components receive normalized data strictly via props. Child components must **never** call `useOnboardingStore()` or `useProfileStore()`.
3. **Data Normalization**: `useProfileData` normalizes backend properties (such as snake_case responses) and Zustand camelCase properties into a unified client schema:
   - `user`: `{ name, email, role, joinDate, streak, level }`
   - `scores`: `{ mindScore, bodyScore, lifestyleScore, overallScore }`
   - `goals`: `{ selectedGoals, primaryGoal, sixMonthVision }`
   - `aiPlan`: `{ wakeTime, sleepTarget, schedule: [{ period, time, items: [{ time, label, type }] }] }`
   - `balanceWheel`: `[{ subject, value, fullMark }]`
   - `insights`: `{ primaryGoal, productiveWindow, burnoutRisk, coachSummary, strengths, risks, focusAreas }`

## Backend Fallback Strategy

The profile functions in a **100% frontend-only offline mode** when backend endpoints do not exist or throw errors.

1. **Attempt Phase**: The page attempts to load database entries using the following endpoints:
   - `GET /api/profile/{userId}`
   - `GET /api/dashboard/{userId}`
   - `GET /api/onboarding/profile/{userId}`
2. **Safe Error Catching**: `profileService.js` wraps requests in try-catch structures, returning `null` if any service is down or returns a 404. It never throws errors or crashes the app.
3. **Zustand Fallback**: If the server returns empty results, `useProfileData` reads local client state from the `useOnboardingStore`.
4. **Configuration Defaults**: If onboarding store is also empty, the system falls back to `profileConfig.js` mock constants.
5. **Sync Status Bar**: `ProfileSyncStatus` renders a green badge showing *"Profile synced successfully"* when backend data resolves, and an amber warning card showing *"Unable to sync latest profile. Showing locally cached onboarding data."* when using the Zustand/config fallback.

## Route Registration

Route registration is located in `src/routes/AppRoutes.jsx`:
```jsx
const Profile = lazy(() => import("../features/profile/Profile"));

// Registered inside AppRoutes:
<Route path="/profile" element={<Profile />} />
```
The entire `<Routes>` tree is wrapped in `<Suspense fallback={<div>Loading...</div>}>` to facilitate splitting.

## Future Backend Integration Notes

When backend APIs are implemented:
1. Create a matching router in the backend matching `/api/profile/{userId}`.
2. The schema should match or return the keys expected in `useProfileData.js` normalize logic.
3. No frontend UI components will require editing because of the strict props-based coupling.
