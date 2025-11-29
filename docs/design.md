# Design System & UI Guidelines

This document outlines the design principles, component patterns, and UI/UX guidelines for the Affill platform.

## Design Philosophy

**Core Principles**:
- **Mobile-First**: Responsive design starting from mobile breakpoints
- **Data-Driven**: Clear information hierarchy for affiliate metrics
- **Accessibility**: WCAG compliance and keyboard navigation
- **Performance**: Optimized loading states and smooth interactions

## Technology Stack

**Styling Framework**:
- **Tailwind CSS v4**: Utility-first CSS with JIT compilation
- **Responsive Utilities**: Mobile-first breakpoint system
- **Custom Components**: Reusable component library
- **Icon System**: Lucide React icons for consistency

## Color System & Branding

**Theme Structure**:
```css
/* Inferred from Tailwind usage - needs customization */
:root {
  --primary: /* Brand primary color */;
  --secondary: /* Brand secondary color */;
  --accent: /* Action/CTA color */;
  --neutral: /* Text and background grays */;
  --success: /* Positive actions, earnings */;
  --warning: /* Caution states */;
  --error: /* Error states, validation */;
}
```

**Usage Guidelines**:
- Primary colors for navigation and main actions
- Success colors for positive metrics (earnings, growth)
- Warning colors for attention states
- Neutral colors for data tables and content areas

## Typography System

**Font Hierarchy**:
```css
/* Recommended typography scale */
.text-display    /* 3xl+ for hero sections */
.text-heading-1  /* 2xl for page titles */
.text-heading-2  /* xl for section headers */
.text-heading-3  /* lg for subsection titles */
.text-body       /* base for general content */
.text-caption    /* sm for metadata, labels */
```

**Implementation**:
- Consistent font weights (400, 500, 600, 700)
- Proper line heights for readability
- Color contrast meeting WCAG AA standards

## Layout Patterns

### Dashboard Layout Structure

**Main Layout** (`src/layouts/`):
```jsx
<DashboardLayout>
  <Header />
  <Sidebar />
  <main>
    <PageContent />
  </main>
  <Footer />
</DashboardLayout>
```

**Grid System**:
- CSS Grid for complex layouts
- Flexbox for component-level alignment
- Responsive breakpoints: sm, md, lg, xl, 2xl

### Component Layout Patterns

**Cards & Containers**:
```jsx
// Standard card pattern
<div className="bg-white rounded-lg shadow-sm border p-6">
  <h3 className="text-lg font-semibold mb-4">Card Title</h3>
  <div className="space-y-4">
    {/* Card content */}
  </div>
</div>
```

**Data Tables**:
- Responsive table design with horizontal scroll
- Consistent padding and spacing
- Clear visual hierarchy for data importance
- Action buttons aligned consistently

## Component Design Patterns

### Form Components

**Input Standards**:
```jsx
// Consistent form field pattern
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    Field Label
  </label>
  <input
    className="w-full px-3 py-2 border border-gray-300 rounded-md
               focus:ring-2 focus:ring-primary focus:border-transparent"
    type="text"
  />
  <p className="text-sm text-gray-500">Helper text</p>
</div>
```

**Form Validation**:
- Inline error messages with red color coding
- Success states with green indicators
- Loading states during form submission

### Button System

**Button Variants**:
```jsx
// Primary action button
<button className="bg-primary text-white px-4 py-2 rounded-md
                   hover:bg-primary-600 focus:ring-2 focus:ring-primary">
  Primary Action
</button>

// Secondary action button
<button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md
                   hover:bg-gray-200 focus:ring-2 focus:ring-gray-500">
  Secondary Action
</button>

// Danger action button
<button className="bg-red-500 text-white px-4 py-2 rounded-md
                   hover:bg-red-600 focus:ring-2 focus:ring-red-500">
  Delete Action
</button>
```

**Button Sizes**:
- Small: `px-3 py-1.5 text-sm`
- Medium: `px-4 py-2 text-base` (default)
- Large: `px-6 py-3 text-lg`

### Data Visualization

**Chart Components** (`src/components/charts/`):
- Consistent color schemes across all charts
- Responsive sizing for different screen sizes
- Interactive tooltips with relevant metrics
- Loading skeletons during data fetch

**Chart Libraries**:
- **ApexCharts**: Primary charting library for complex visualizations
- **Recharts**: React-native charts for simpler data displays
- Custom styling to match brand colors

### Loading States

**Component Loading Patterns**:
```jsx
// Skeleton loader pattern
{isLoading ? (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
) : (
  <ActualContent />
)}
```

**Loading Indicators**:
- Skeleton screens for content areas
- Spinner components for actions
- Progress indicators for multi-step processes

## Responsive Design Guidelines

**Breakpoint Strategy**:
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices (phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* 2X large devices (large desktops) */
```

**Mobile-First Approach**:
1. Design components for mobile screens first
2. Use `md:` and `lg:` prefixes for larger screen enhancements
3. Stack navigation and sidebar appropriately on smaller screens
4. Ensure touch targets are at least 44px

**Component Responsiveness**:
- Tables convert to card layouts on mobile
- Charts resize appropriately for viewport
- Navigation collapses to hamburger menu
- Form layouts adjust for smaller screens

## Animation & Interaction

**Motion Principles**:
```jsx
// Using motion library for animations
import { motion } from 'motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content with entrance animation
</motion.div>
```

**Interaction States**:
- Hover effects for interactive elements
- Focus states for keyboard navigation
- Disabled states with reduced opacity
- Loading states with appropriate feedback

## Accessibility Guidelines

**WCAG Compliance**:
- Color contrast ratios of 4.5:1 minimum
- Proper semantic HTML structure
- Screen reader compatible navigation
- Keyboard navigation support

**Implementation**:
- Alt text for all images and icons
- Proper heading hierarchy (h1 -> h6)
- Focus management for modal dialogs
- ARIA labels for complex interactive elements

## Component Library Organization

**Structure** (`src/components/`):
```
components/
├── ui/              # Base UI components (buttons, inputs)
├── charts/          # Data visualization components
├── dashboard/       # Dashboard-specific widgets
├── forms/           # Form components and validation
├── layout/          # Layout and navigation components
└── [feature]/       # Feature-specific components
```

**Component API Pattern**:
```tsx
interface ComponentProps {
  // Props should be descriptive and typed
  title: string;
  isLoading?: boolean;
  onAction?: () => void;
  className?: string; // For style overrides
}

export default function Component({
  title,
  isLoading = false,
  onAction,
  className = ''
}: ComponentProps) {
  return (
    <div className={`base-styles ${className}`}>
      {/* Component implementation */}
    </div>
  );
}
```

## Design Implementation Checklist

**New Component Checklist**:
- [ ] Responsive design across all breakpoints
- [ ] Consistent spacing using Tailwind scale
- [ ] Proper loading and error states
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Consistent with existing component patterns
- [ ] Proper TypeScript interfaces

**Design Review Criteria**:
- Visual consistency with existing components
- Performance optimization (avoid layout shifts)
- Accessibility compliance
- Mobile usability
- Cross-browser compatibility

---

*This design system should evolve with the platform. Update component patterns as new requirements emerge and design consistency improves.*