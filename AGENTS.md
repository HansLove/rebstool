# Affill Frontend - Technical Guidelines for Agents

Affill is a React-based affiliate management platform with blockchain integration, built using modern TypeScript patterns and component architecture. This document provides complete technical guidelines for Claude Code agents working on this codebase.

For business context and user documentation, see [README.md](./README.md)

## Quick Reference

- **README.md**: [README.md](./README.md) - Business context and user documentation
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Test**: No test framework currently configured
- **Development**: `npm run dev` (Vite dev server with HMR)
- **Linting**: `npm run lint` (ESLint with TypeScript rules)

## Documentation Map

- **[API Documentation](./docs/api.md)** - API integration patterns, service layer architecture, and React Query usage
- **[Design System](./docs/design.md)** - UI/UX guidelines, component patterns, and design system
- **[Deployment Guide](./docs/deployment.md)** - Build processes, deployment strategies, and infrastructure
- **[Directory Structure](./docs/directory-structure.md)** - Directory structure and modular architecture overview
- **[Payments Integration](./docs/payments.md)** - NowPayments API integration guide (deposits/withdrawals)
- **[WebSocket Guide](./docs/websockets.md)** - WebSocket notification system integration

## Project Structure

The codebase follows a feature-based organization with clear separation of concerns:

```shell
src/
├── app/routes/           # Route configuration and navigation
├── components/           # Feature-organized reusable components
│   ├── accounts/         # Account management forms and UI
│   ├── blockchain/       # Web3 integration and crypto components
│   ├── charts/           # Data visualization components
│   ├── dashboard/        # Dashboard widgets and tables
│   └── [other features]  # Organized by business domain
├── constants/            # Application constants and configuration
├── context/              # React Context providers (Global, Blockchain, Sidebar)
├── core/                 # Core business logic and utilities
│   ├── analyzers/        # Business logic analyzers (Commission, User)
│   ├── hooks/            # Custom React hooks (useAuth, etc.)
│   ├── types/            # TypeScript interfaces and types
│   └── utils/            # Utility functions and helpers
├── hooks/                # Additional custom hooks (⚠️ Consider consolidating with core/hooks/)
├── interfaces/           # Type definitions (⚠️ Duplicates core/types/ - see antipatterns)
├── layouts/              # Layout components and wrappers
├── lib/                  # Third-party utilities and helper functions
├── modules/              # Feature modules with encapsulated logic
│   ├── affiliates/       # Affiliate management module
│   ├── analytics/        # Analytics and reporting module
│   ├── marketing/        # Marketing tools and content
│   └── subAffiliates/    # Sub-affiliate management module
├── pages/                # Route-specific page components
└── services/             # API communication and external services
```

## Code Standards

### Naming Conventions

**Components & Files:**

- Components: `PascalCase` (e.g., `EarningsChart.tsx`, `MasterAffiliateInvitation.tsx`)
- Files: `camelCase` for utilities, `PascalCase` for components
- Directories: `camelCase` (e.g., `activeInactiveUsers/`, `subAffiliates/`)

**Variables & Functions:**

- Variables: `camelCase` (e.g., `userData`, `trackingCode`)
- Functions: `camelCase` describing action (e.g., `getToken`, `setToken`, `isLoggedIn`)
- Hooks: `use[Feature]` pattern (e.g., `useAuth`, `useDeposits`)

**Types & Interfaces:**

- Interfaces: `PascalCase` + `Interface` suffix (e.g., `AuthUserInterface`, `UserDataType`)
- Type definitions: `PascalCase` + `Type` suffix (e.g., `UserDataType`)

### Component Patterns

**File Organization:**

```shell
// Feature-based component structure
components/
├── dashboard/
│   ├── table/
│   │   ├── components/     # Sub-components
│   │   ├── interfaces.ts   # Type definitions
│   │   └── utils/          # Helper functions
│   └── activeInactiveUsers/
│       └── types/
│           └── IProps.ts   # Component prop types
```

**React Patterns:**

- Custom hooks for business logic (see `useAuth.tsx`)
- Interface definitions for component props
- Functional components with TypeScript
- Props interface naming: `IProps` or descriptive names

### TypeScript Standards

**Interface Design:**

```typescript
// Good: Descriptive, snake_case for API data
interface UserDataType {
  user_id: string;
  registration_date: string;
  tracking_code: string;
  // ... matches API response format
}

// Good: Clear interface contracts
interface AuthUserInterface {
  token: string | null;
  setToken: (user: any, token: string) => void;
  getToken: () => string | null;
  isLoggedIn: () => boolean;
}
```

**Type Safety:**

- Use `any` sparingly and document with eslint-disable comments
- Define interfaces for all component props
- Type API responses and business data models
- **Service Pattern**: Define request/response interfaces in service files

```typescript
// Good: Specific interfaces for API calls (see depositService.ts)
interface DepositRequest {
  amount: number;
  price_currency: string;
  pay_currency: string;
  order_description: string;
}

interface DepositApiResponse {
  success: boolean;
  message: string;
  data: {
    /* ... */
  };
}

export async function createDepositService(depositData: DepositRequest): Promise<DepositApiResponse> {
  const res = await http.post('crypto-payments/deposits', depositData);
  return res.data;
}

// Avoid: Using 'any' for service parameters
export async function createService(formData: any) {
  /* ... */
}
```

### Architecture Patterns

**Authentication:**

- Centralized in `core/hooks/useAuth.tsx`
- localStorage for token persistence
- JWT token-based authentication
- Route protection via `PrivateRoute` component

**State Management:**

- React Query (@tanstack/react-query) for server state
- Local component state with useState
- Context API for global UI state (sidebar, etc.)

**API Integration:**

- Axios for HTTP requests with interceptors
- Centralized request handling in services/
- TypeScript interfaces for request/response data
- See [API Documentation](./docs/api.md) for detailed patterns

**Blockchain Integration:**

- wagmi + viem for Ethereum integration
- RainbowKit for wallet connection UI
- Smart contract interfaces in components/blockchain/

## Antipatterns to Address

**Current Issues for Gradual Improvement:**

1. **Mixed Directory Naming**: Some `PascalCase` (Socios/), some `camelCase` (subAffiliates/)
   - **Target**: Standardize on `camelCase` for directories
   - **Location**: `src/components/Socios/` → `src/components/socios/`, `src/pages/SubAffiliates/` → `src/pages/subAffiliates/`

2. **Duplicate Type Definition Locations**:
   - **Problem**: Both `src/interfaces/` AND `src/core/types/` exist with overlapping purposes
   - **Impact**: Confusion about where to place new types, potential duplicates
   - **Target**: Consolidate all types in `core/types/` with feature-based organization
   - **Example**: `interfaces/User.ts` vs `core/types/userData.ts`

3. **Duplicate Hook Locations**:
   - **Problem**: Both `src/hooks/` AND `src/core/hooks/` exist
   - **Impact**: Unclear where to add new hooks
   - **Target**: Consolidate all custom hooks in `core/hooks/`
   - **Current**: `hooks/useTheme.ts` should move to `core/hooks/useTheme.ts`

4. **Deep Nesting in Pages**:
   - Multiple levels: `pages/auth/login/types/`, `pages/SubAffiliates/dashboard/`
   - **Target**: Flatten structure, move shared types to `core/types/`

5. **Inconsistent Service Type Safety**:
   - **Problem**: Some services use `any` types (api.ts), others use specific interfaces (depositService.ts)
   - **Target**: All service functions should have typed parameters and return types
   - **Good Example**: `depositService.ts` with `DepositRequest` and `DepositApiResponse`
   - **Needs Improvement**: `api.ts` functions using `formData: any`

## Technology Stack Integration

**Build & Development:**

- **Vite**: Fast development server, optimized production builds
- **TypeScript**: Strict typing with `tsconfig.app.json` configuration
- **ESLint**: Code quality with React and TypeScript rules

**UI & Styling:**

- **Tailwind CSS v4**: Utility-first CSS with JIT compilation
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Component Library**: Custom components with consistent styling

**Data & State:**

- **React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Efficient form handling with validation
- **Context API**: Global state for UI concerns (sidebar, auth)

**Blockchain & Payments:**

- **wagmi v2**: React hooks for Ethereum interaction
- **viem**: Low-level Ethereum client library
- **RainbowKit**: Wallet connection and management UI
- **@taloon/nowpayments-components**: Payment processing integration

## Development Workflow

**Component Creation:**

1. Follow existing patterns in similar components
2. Use feature-based organization in `components/[feature]/`
3. Define TypeScript interfaces for props and data
4. Implement error handling and loading states

**Adding New Features:**

1. **Determine Feature Scope**:
   - Small features: Add to existing `pages/` or `components/`
   - Large features with multiple components: Create in `modules/[feature]/`
   - Modules example: `modules/analytics/`, `modules/marketing/`

2. Create page component in `pages/[feature]/` or `modules/[feature]/`
3. Add route to `app/routes/AppRouter.tsx`
4. Create supporting components in `components/[feature]/` or within module
5. Define types in `core/types/` or feature-local files

**Module Structure** (for large features):

```shell
modules/
└── [feature-name]/
    ├── components/      # Feature-specific components
    ├── services/        # Feature-specific API calls
    ├── hooks/           # Feature-specific hooks
    ├── types/           # Feature-specific types
    └── [FeaturePage].tsx
```

**API Integration:**

1. **Define request/response interfaces** in the service file (see [API Documentation](./docs/api.md))
2. Create typed service functions in `services/`
3. Use React Query for data fetching and caching
4. Handle loading and error states in components

## Build & Deployment

**Available Scripts:**

- `npm run dev`: Development server with hot module replacement
- `npm run build`: Production build (TypeScript check + Vite build)
- `npm run lint`: ESLint code quality checks
- `npm run preview`: Local preview of production build

**Environment Configuration:**

- Environment variables in `.env` file
- Build-time configuration via Vite
- TypeScript compilation before bundling

See [Deployment Guide](./docs/deployment.md) for detailed deployment strategies and infrastructure setup.

## Cross-References

**Best Practice Examples:**

- **Authentication Hook**: `src/core/hooks/useAuth.tsx` - Custom hook pattern with TypeScript
- **Typed Service**: `src/services/depositService.ts` - Proper interface usage for API calls
- **Module Structure**: `src/modules/analytics/` - Large feature organization
- **Component Organization**: `src/components/dashboard/table/` - Feature-based component structure
- **Context Provider**: `src/context/GlobalProvider.tsx` - React Context pattern

**Needs Improvement:**

- **Untyped Service**: `src/services/api.ts` - Should use specific interfaces instead of `any`
- **Duplicate Directories**: `src/hooks/` vs `src/core/hooks/`, `src/interfaces/` vs `src/core/types/`

---

_This documentation is focused on patterns and principles that remain relevant as the codebase evolves. Update antipatterns section as issues are resolved._
