# 🚀 Quick Start Guide - Sub-Affiliate Refactor

## ✨ What's New?

The Sub-Affiliate section has been completely refactored for better organization, modularity, and maintainability.

---

## 🎯 Key Features

### 1. New Unified Dashboard
Access the new `RebtoolsOneViewWireframe` at:
```
/subs/one-view
```

This is a modern, placeholder dashboard that will eventually consolidate all sub-affiliate views.

### 2. Organized Route Structure
Routes are now grouped into logical categories:
- 🏠 **CORE**: dashboard, resume, one-view
- 💰 **EARNINGS**: yourEarnings, payouts, performance
- 🌐 **NETWORK**: mynetwork, registrations
- 📚 **RESOURCES**: marketing, tutorial, settings

### 3. Custom Data Hook
Reusable data fetching with `useSubsDashboardData()`:
```typescript
import { useSubsDashboardData } from "@/layouts/hooks/useSubsDashboardData";

const { registrationsReport, deal, isLoading, error } = useSubsDashboardData();
```

### 4. Type Safety
Full TypeScript support with centralized types:
```typescript
import { SubsLayoutContext } from "@/layouts/types/subsLayout.types";
```

---

## 📁 New Files

| File | Purpose |
|------|---------|
| `src/pages/SubAffiliates/dashboard/RebtoolsOneViewWireframe.tsx` | New unified dashboard |
| `src/app/routes/subsRoutes.config.ts` | Route constants & configuration |
| `src/layouts/hooks/useSubsDashboardData.ts` | Custom data fetching hook |
| `src/layouts/types/subsLayout.types.ts` | TypeScript type definitions |
| `src/layouts/README.md` | Layouts documentation |
| `src/app/routes/README.md` | Routes documentation |
| `docs/REFACTOR_SUMMARY.md` | Complete refactor summary |
| `docs/ARCHITECTURE_DIAGRAM.md` | Visual architecture guide |

---

## 🔧 How to Use

### Adding a New Route

1. **Add constant to config:**
```typescript
// src/app/routes/subsRoutes.config.ts
export const SUBS_ROUTE_PATHS = {
  MY_NEW_PAGE: 'my-new-page',
};
```

2. **Create lazy component:**
```typescript
// src/app/routes/subsRoutes.tsx
const MyNewPage = lazy(() => import('@/pages/MyNewPage'));
```

3. **Add to routes array:**
```typescript
{
  path: SUBS_ROUTE_PATHS.MY_NEW_PAGE,
  element: withSuspense(MyNewPage),
  group: 'resources' as const,
}
```

### Using Context Data in Components

```typescript
import { useOutletContext } from "react-router-dom";
import { SubsLayoutContext } from "@/layouts/types/subsLayout.types";

export default function MyComponent() {
  const { registrationsReport, deal, userSlug, isLoading } = 
    useOutletContext<SubsLayoutContext>();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Deal: {deal}%</h1>
      <p>Total Registrations: {registrationsReport.length}</p>
    </div>
  );
}
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Layouts README](src/layouts/README.md) | SubsLayout architecture & usage |
| [Routes README](src/app/routes/README.md) | Route configuration & patterns |
| [Refactor Summary](docs/REFACTOR_SUMMARY.md) | Complete change summary |
| [Architecture Diagram](docs/ARCHITECTURE_DIAGRAM.md) | Visual system overview |

---

## ✅ Status

- ✅ All refactoring completed
- ✅ Zero linter errors
- ✅ Full TypeScript support
- ✅ Lazy loading preserved
- ✅ Backward compatible
- ✅ Comprehensive documentation

---

## 🎨 Route Map

```
/subs/
  ├── dashboard              (SubRebtoolsiateResume)
  ├── resume                 (SubRebtoolsiateResume)
  ├── one-view               (RebtoolsOneViewWireframe) ⭐ NEW
  ├── yourEarnings           (PaymentsRegistersTable)
  ├── payouts                (Payouts)
  ├── performance            (Performance)
  ├── mynetwork              (MyNetwork)
  ├── sub/registrations      (MyRegistration)
  ├── marketing              (MarketingLab)
  ├── sub-affiliate-tutorial (SubAffiliateTutorial)
  └── yourConfig             (SubsRebtoolsiatesSettings)
```

---

## 🚀 Next Steps

1. Test the new `/subs/one-view` route
2. Review the architecture documentation
3. Consider updating navigation to include the one-view link
4. Plan implementation of full dashboard functionality

---

## 💡 Tips

- Use route constants from `subsRoutes.config.ts` instead of hardcoded strings
- Import types from `subsLayout.types.ts` for consistency
- Leverage the custom `useSubsDashboardData` hook for data fetching
- Follow the established patterns when adding new routes
- Check documentation files for detailed explanations

---

**Version:** 2.0  
**Date:** October 10, 2025  
**Status:** ✅ Ready for Development

