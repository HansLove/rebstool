# API Documentation & Integration Patterns

This document covers API communication patterns, service layer architecture, and data integration guidelines for the Affill platform.

## Service Layer Architecture

### HTTP Client Configuration

The application uses Axios as the primary HTTP client with interceptors for authentication and error handling:

**Location**: `src/services/` (inferred from architecture)
**Pattern**: Centralized request handling with token injection

### Authentication Flow

**Token Management**:
```typescript
// From src/core/hooks/useAuth.tsx
interface AuthUserInterface {
  token: string | null;
  setToken: (user: any, token: string) => void;
  getToken: () => string | null;
  isLoggedIn: () => boolean;
  logout: () => void;
}
```

**Storage Strategy**:
- JWT tokens stored in localStorage
- User data cached locally for offline access
- Automatic token injection via Axios interceptors
- Token validation on app initialization

### API Response Patterns

**User Data Structure**:
```typescript
// From src/core/types/userData.ts
interface UserDataType {
  user_id: string;
  registration_date: string;
  brand: string;
  tracking_code: string;
  afp: string;
  language: string;
  type: string;
  // ... additional fields matching API schema
}
```

**Response Handling**:
- Snake_case from API (matches backend conventions)
- Direct mapping without transformation for consistency
- Type-safe interfaces for all API responses

## React Query Integration

**State Management Pattern**:
- Server state managed via @tanstack/react-query
- Local UI state via React hooks
- Optimistic updates for user actions
- Background refetching for data freshness

**Query Configuration**:
```typescript
// Recommended patterns for new API integrations
const { data, isLoading, error } = useQuery({
  queryKey: ['feature', userId],
  queryFn: () => fetchFeatureData(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
});
```

## Data Transformation Patterns

### API Response Handling

**Consistent Patterns**:
- Preserve API field naming (snake_case) in TypeScript interfaces
- Handle null/undefined values gracefully
- Implement proper error boundaries for failed requests

**Error Handling**:
```typescript
// Pattern for service functions
const handleApiError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Trigger logout and redirect
    useAuth().logout();
  }
  throw new Error(error.response?.data?.message || 'Request failed');
};
```

## Blockchain API Integration

**Web3 Provider Configuration**:
- wagmi v2 for Ethereum interactions
- RainbowKit for wallet connection UI
- Smart contract ABIs in `src/components/blockchain/deployments/`

**Contract Integration Pattern**:
```typescript
// Example from blockchain components
import { useReadContract, useWriteContract } from 'wagmi';

// Read operations
const { data: balance } = useReadContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'balanceOf',
  args: [userAddress],
});

// Write operations with transaction handling
const { writeContract, isLoading: isTransacting } = useWriteContract();
```

## API Endpoint Organization

**Feature-Based Structure**:
```
services/
├── auth/           # Authentication endpoints
├── affiliates/     # Affiliate management APIs
├── payments/       # Payment processing
├── analytics/      # Dashboard and reporting data
└── blockchain/     # Smart contract interactions
```

**Request Configuration**:
- Base URL configuration via environment variables
- Request/response interceptors for common patterns
- Retry logic for network failures
- Request/response logging in development

## Data Caching Strategy

**React Query Configuration**:
- User data: Long cache time (30 minutes)
- Analytics: Medium cache time (5 minutes)
- Real-time data: Short cache time (1 minute)
- Static data: Cache indefinitely with manual invalidation

**Cache Invalidation**:
```typescript
// Invalidate related queries after mutations
const queryClient = useQueryClient();
await queryClient.invalidateQueries(['user', 'affiliates']);
```

## Environment Configuration

**API Configuration**:
```env
# Expected environment variables
VITE_API_BASE_URL=https://api.affill.com
VITE_BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/...
VITE_CONTRACT_ADDRESS=0x...
```

**Development vs Production**:
- Different API endpoints for environments
- Feature flags via environment variables
- Debug logging configuration

## Integration Guidelines

**Adding New API Endpoints**:

1. **Define TypeScript Interfaces**:
   - Create interfaces in `src/core/types/`
   - Match API response structure exactly
   - Use snake_case to match backend conventions

2. **Create Service Function**:
   - Add to appropriate service module
   - Include proper error handling
   - Return typed responses

3. **Implement React Query Hook**:
   - Create custom hook in `src/hooks/` or component-local
   - Configure appropriate caching strategy
   - Handle loading and error states

4. **Update Components**:
   - Replace mock data with real API calls
   - Add proper loading states
   - Implement error boundaries

**Testing API Integration**:
- Mock API responses for development
- Use React Query devtools for debugging
- Implement proper error scenarios

## Security Considerations

**Token Security**:
- Automatic token refresh before expiration
- Secure token storage (consider httpOnly cookies for production)
- Proper logout cleanup

**Request Security**:
- HTTPS-only in production
- Request validation and sanitization
- Rate limiting awareness in client code

---

*For implementation examples, see existing components in `src/components/` and `src/pages/`. This documentation should be updated as new API patterns are established.*