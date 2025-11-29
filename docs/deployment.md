# Deployment & Infrastructure Guide

This document covers build processes, deployment strategies, and infrastructure considerations for the Affill platform.

## Build Process

### Development Build

**Local Development**:
```bash
npm run dev
# Starts Vite development server with:
# - Hot Module Replacement (HMR)
# - TypeScript compilation
# - Tailwind CSS JIT compilation
# - Source maps for debugging
```

**Development Features**:
- Fast rebuild times with Vite
- TypeScript error reporting
- ESLint integration
- Environment variable loading from `.env`

### Production Build

**Build Command**:
```bash
npm run build
# Executes: tsc -b && vite build
# 1. TypeScript compilation check
# 2. Vite optimization and bundling
```

**Build Optimization**:
- Tree shaking for unused code elimination
- Code splitting for dynamic imports
- Asset optimization (images, fonts, etc.)
- CSS purging via Tailwind CSS
- Modern JavaScript target for optimal performance

**Build Output** (`dist/`):
```
dist/
├── assets/          # Optimized CSS, JS, and media files
├── index.html       # Main application entry point
└── [additional assets]
```

### Build Verification

**Quality Checks**:
```bash
# TypeScript compilation check
npm run build   # Includes tsc -b

# Code quality validation
npm run lint    # ESLint checks

# Production preview
npm run preview # Local server for build testing
```

## Environment Configuration

### Environment Variables

**Required Variables**:
```env
# API Configuration
VITE_API_BASE_URL=https://api.affill.com/v1

# Blockchain Configuration
VITE_BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=1

# Application Configuration
VITE_APP_NAME=Affill
VITE_APP_VERSION=1.0.0

# Third-party Services
VITE_NOWPAYMENTS_API_KEY=your_api_key
VITE_GOOGLE_ANALYTICS_ID=GA-...
```

**Environment-Specific Files**:
```
.env                 # Default environment variables
.env.local           # Local overrides (gitignored)
.env.development     # Development-specific variables
.env.production      # Production-specific variables
```

### Configuration Management

**Runtime Configuration**:
- All environment variables prefixed with `VITE_`
- Variables available in client-side code
- No sensitive data in client environment

**Feature Flags**:
```env
# Feature toggles
VITE_ENABLE_BLOCKCHAIN=true
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

## Deployment Strategies

### Static Site Deployment

**Recommended Platforms**:
- **Vercel**: Zero-config deployment with Git integration
- **Netlify**: Continuous deployment with form handling
- **Cloudflare Pages**: Global CDN with edge functions
- **AWS S3 + CloudFront**: Custom infrastructure setup

**Deployment Configuration** (Vercel example):
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

### Container Deployment

**Docker Configuration**:
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration**:
```nginx
# nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

## Performance Optimization

### Bundle Optimization

**Code Splitting**:
```typescript
// Route-based code splitting
import { lazy } from 'react';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Analytics = lazy(() => import('../pages/Analytics'));
```

**Asset Optimization**:
- Image optimization with modern formats (WebP, AVIF)
- Font subsetting for reduced file sizes
- CSS purging with Tailwind CSS
- JavaScript minification and compression

### Caching Strategy

**Static Assets**:
```nginx
# Long-term caching for versioned assets
location /assets/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Short-term caching for HTML
location / {
  expires 5m;
  add_header Cache-Control "public, must-revalidate";
}
```

**API Caching**:
- React Query caching configuration
- Service worker for offline functionality
- CDN caching for static content

## Monitoring & Analytics

### Performance Monitoring

**Web Vitals Tracking**:
```typescript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

**Error Monitoring**:
- Production error boundary implementation
- Client-side error reporting
- Performance metric collection

### Analytics Integration

**Google Analytics Setup**:
```typescript
// GA4 integration
import { gtag } from 'ga-gtag';

gtag('config', process.env.VITE_GOOGLE_ANALYTICS_ID, {
  page_title: document.title,
  page_location: window.location.href,
});
```

## Security Considerations

### Content Security Policy

**CSP Headers**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.affill.com wss:;
```

### HTTPS Configuration

**SSL/TLS Requirements**:
- Force HTTPS in production
- HSTS headers for security
- Secure cookie configuration
- Mixed content prevention

### Environment Security

**Production Checklist**:
- [ ] No debug information exposed
- [ ] API keys properly configured
- [ ] Error messages don't leak sensitive data
- [ ] Source maps disabled in production
- [ ] Dependency vulnerability scanning

## CI/CD Pipeline

### Automated Deployment

**GitHub Actions Example**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test # When tests are added

      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_BLOCKCHAIN_RPC_URL: ${{ secrets.BLOCKCHAIN_RPC_URL }}

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Quality Gates

**Pre-deployment Checks**:
- TypeScript compilation success
- ESLint validation passing
- Build process completion
- Bundle size analysis
- Security vulnerability scan

## Rollback Strategy

**Deployment Rollback**:
- Git-based rollback to previous commit
- Platform-specific rollback features (Vercel, Netlify)
- Database migration considerations
- Cache invalidation after rollback

**Monitoring Post-Deployment**:
- Error rate monitoring
- Performance metric tracking
- User feedback collection
- A/B testing for major changes

---

*This deployment guide should be updated as infrastructure requirements evolve and new deployment targets are added.*