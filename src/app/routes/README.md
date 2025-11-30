# Routes Architecture

This directory contains the routing configuration for the application.

## 📁 Structure

```
routes/
├── AppRouter.tsx              # Main router component
├── RequireAuth.tsx            # Authentication guard
├── PublicRoute.tsx            # Public route wrapper
├── withSuspense.tsx           # Lazy loading wrapper
├── routes.ts                  # Route constants
├── RebtoolsiatesRoutes.tsx      # Master affiliate routes
├── subsRoutes.tsx             # Sub-affiliate routes (REFACTORED)
├── subsRoutes.config.ts       # Route configuration (NEW)
└── sharedRoutes.tsx           # Shared routes
```

## 🎯 Sub-Affiliate Routes (Refactored)

The sub-affiliate routes have been refactored for better organization and maintainability.

### Route Groups

Routes are now organized into logical sections:

#### 🏠 CORE Routes
Primary dashboard and overview pages
- `dashboard` → SubRebtoolsiateResume
- `resume` → SubRebtoolsiateResume  
- `one-view` → RebtoolsOneViewWireframe (NEW)

#### 💰 EARNINGS Routes
Financial tracking and performance
- `yourEarnings` → PaymentsRegistersTable
- `payouts` → Payouts
- `performance` → Performance

#### 🌐 NETWORK Routes
User network and registration management
- `mynetwork` → MyNetwork
- `sub/registrations` → MyRegistration

#### 📚 RESOURCES Routes
Supporting tools, tutorials, and settings
- `marketing` → MarketingLab
- `sub-affiliate-tutorial` → SubAffiliateTutorial
- `yourConfig` → SubsRebtoolsiatesSettings

### Configuration File

`subsRoutes.config.ts` provides:
- Centralized route path constants
- Route grouping definitions
- TypeScript types for type safety

```typescript
import { SUBS_ROUTE_PATHS } from './subsRoutes.config';

// Use constants instead of strings
const path = SUBS_ROUTE_PATHS.DASHBOARD; // 'dashboard'
```

### Benefits

1. **Logical Organization**: Routes grouped by functionality
2. **Type Safety**: Full TypeScript support
3. **Maintainability**: Easy to add/modify routes
4. **Documentation**: Clear structure with comments
5. **Lazy Loading**: All heavy modules lazy-loaded
6. **Consistency**: Standardized route definitions

### Route Metadata

Each route now includes metadata:
```typescript
{
  path: 'dashboard',
  element: <Component />,
  group: 'core' // Identifies route category
}
```

## 🔐 Authentication

Routes are protected by:
- `RequireAuth` - Ensures user is authenticated
- Role-based checks within components

## 🌐 Router Structure

```
AppRouter
├── Public Routes
│   ├── Landing Page
│   ├── Login
│   └── Register
├── Authenticated Routes
│   ├── Master Affiliate (RebtoolsiatesRoutes)
│   └── Sub-Affiliate (subsRoutes)
└── Shared Routes
    └── Settings, etc.
```

## 🎨 Usage

### Adding a New Route

1. Add path constant to `subsRoutes.config.ts`:
```typescript
export const SUBS_ROUTE_PATHS = {
  // ... existing paths
  NEW_PAGE: 'new-page',
};
```

2. Add route to appropriate group in `subsRoutes.tsx`:
```typescript
{
  path: SUBS_ROUTE_PATHS.NEW_PAGE,
  element: withSuspense(NewPage),
  group: 'resources' as const,
}
```

3. Create the lazy-loaded component:
```typescript
const NewPage = lazy(() => import('@/pages/NewPage'));
```

### Lazy Loading Pattern

All routes use `withSuspense()` for consistent loading states:
```typescript
const MyComponent = lazy(() => import('@/pages/MyComponent'));

// In route definition
element: withSuspense(MyComponent)
```

## 🚀 Future Enhancements

- [ ] Add breadcrumb generation from route metadata
- [ ] Implement route-based permissions
- [ ] Add analytics tracking per route
- [ ] Create route transition animations
- [ ] Add route preloading on hover

