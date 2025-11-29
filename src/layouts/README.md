# SubsLayout Architecture

This directory contains the refactored Sub-Affiliate Layout system with improved modularity and organization.

## 🏗️ Structure Overview

```
layouts/
├── SubsLayout.tsx              # Main layout component
├── InviteModal.tsx             # Invite modal component
├── MasterLayout.tsx            # Master affiliate layout
├── components/
│   └── SubsNavbar.tsx          # Sub-affiliate navigation
├── hooks/
│   └── useSubsDashboardData.ts # Custom hook for data fetching
└── types/
    └── subsLayout.types.ts     # TypeScript type definitions
```

## 📦 Components

### SubsLayout.tsx
Main layout component for the sub-affiliate dashboard area. Provides:
- Consistent navigation via `SubsNavbar`
- Data context for nested routes via `Outlet`
- Invite modal management
- Responsive layout with dark mode support
- Centralized loading and error states

**Context Provided:**
```typescript
{
  registrationsReport: any[],
  deal: number,
  userSlug: string | null,
  isLoading: boolean
}
```

### InviteModal.tsx
Modal component for inviting new sub-affiliates.

### SubsNavbar (components/)
Navigation bar component specific to the sub-affiliate dashboard.

## 🪝 Custom Hooks

### useSubsDashboardData.ts
Centralized data fetching hook that:
- Fetches sub-affiliate dashboard data
- Manages loading and error states
- Provides typed return values
- Handles authentication context

**Returns:**
```typescript
{
  registrationsReport: any[],
  deal: number,
  isLoading: boolean,
  error: string | null
}
```

## 📘 Types

### subsLayout.types.ts
Contains all TypeScript type definitions:
- `SubsLayoutContext`: Context data structure
- `SubsDashboardResponse`: API response structure
- `SubsNavbarProps`: Navigation props
- `InviteModalProps`: Modal props

## 🛣️ Routes

Routes are defined in `src/app/routes/subsRoutes.tsx` and organized into logical groups:

### Core Routes
- `dashboard` - Main dashboard view
- `resume` - Resume overview
- `one-view` - New unified dashboard (AffillOneViewWireframe)

### Earnings Routes
- `yourEarnings` - Earnings details
- `payouts` - Payout history
- `performance` - Performance analytics

### Network Routes
- `mynetwork` - Network overview
- `sub/registrations` - Registration management

### Resources Routes
- `marketing` - Marketing materials
- `sub-affiliate-tutorial` - Tutorial content
- `yourConfig` - Settings and configuration

## 🎨 Usage Example

```tsx
// In a child route component
import { useOutletContext } from "react-router-dom";
import { SubsLayoutContext } from "@/layouts/types/subsLayout.types";

export default function MyComponent() {
  const { registrationsReport, deal, userSlug } = 
    useOutletContext<SubsLayoutContext>();
  
  return (
    <div>
      {/* Use context data */}
    </div>
  );
}
```

## 🔄 Data Flow

```
SubsLayout
  ↓
useSubsDashboardData (hook)
  ↓
http.get('subaffiliate/dashboard/:id')
  ↓
Context provided to child routes via <Outlet>
  ↓
Child components consume via useOutletContext()
```

## ✨ Benefits

1. **Separation of Concerns**: Data fetching logic separated from UI
2. **Type Safety**: Full TypeScript support with proper types
3. **Reusability**: Custom hooks can be reused across components
4. **Maintainability**: Clear structure and documentation
5. **Error Handling**: Centralized error and loading states
6. **Testability**: Isolated logic easier to unit test

## 🚀 Future Improvements

- [ ] Add error boundary for graceful error handling
- [ ] Implement data caching/memoization
- [ ] Add refresh functionality
- [ ] Create loading skeleton components
- [ ] Add analytics tracking

