# Affill - Affiliate Management Platform

Affill is a comprehensive web-based affiliate management platform built for tracking, managing, and optimizing affiliate partnerships. The platform provides real-time analytics, commission tracking, payment processing, and network management tools for both affiliate partners and administrators.

## Overview

This platform enables businesses to manage their affiliate networks efficiently by providing:

- **Partner Dashboard**: Real-time earnings tracking, performance metrics, and commission reports
- **Network Management**: Sub-affiliate recruitment, hierarchical commission structures, and team oversight
- **Financial Operations**: Automated commission calculations, payment processing via blockchain and traditional methods
- **Analytics & Reporting**: Comprehensive dashboards, geographical performance maps, and detailed financial reports
- **Account Management**: User authentication, profile management, and access control

## Key Features

- 🏦 **Multi-Payment Support**: Blockchain payments (Web3/wagmi), cryptocurrency processing, and traditional payment methods
- 📊 **Advanced Analytics**: Real-time charts, geographical heat maps, and performance tracking
- 🌐 **Global Reach**: Multi-language support, country-specific reporting, and international payment processing
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS and modern UI components
- 🎯 **Performance Optimization**: React Query for data management, optimized table rendering, and efficient state management

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
Create a `.env` file in the root directory with your configuration variables.

4. **Start development server:**
```bash
npm run dev
```

## Usage

### Development Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create production build with TypeScript compilation
npm run lint     # Run ESLint code quality checks
npm run preview  # Preview production build locally
```

### Project Structure

The application follows a modular architecture with clear separation of concerns:

- **Pages**: Route-specific components located in `src/pages/`
- **Components**: Reusable UI components organized by feature in `src/components/`
- **Core Logic**: Authentication, types, and utilities in `src/core/`
- **Services**: API communication and external service integrations in `src/services/`

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS v4 with utility-first approach
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router DOM for client-side navigation
- **Blockchain Integration**: wagmi, viem, and ethers.js for Web3 functionality
- **UI Components**: Custom component library with Lucide icons
- **Data Visualization**: ApexCharts and Recharts for analytics
- **Forms**: React Hook Form for efficient form handling

## Contributing

For technical implementation details, coding standards, and architecture guidelines, see [CLAUDE.md](./CLAUDE.md).

### Quick Start for Contributors

1. Review the technical guidelines in `CLAUDE.md`
2. Check the existing component patterns in `src/components/`
3. Follow the established TypeScript interfaces in `src/core/types/`
4. Ensure all new features include proper error handling and loading states

## License

This project is proprietary software developed for affiliate management operations.

---

**Questions or Issues?** Review the technical documentation in `CLAUDE.md` or check the existing component implementations for guidance.