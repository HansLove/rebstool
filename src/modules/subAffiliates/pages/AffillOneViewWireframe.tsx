import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { SubsLayoutContext } from "@/layouts/types/subsLayout.types";

/**
 * AffillOneViewWireframe
 * 
 * Temporary placeholder for the new unified "Affill One-View" dashboard concept.
 * This component will eventually replace the scattered sub-affiliate dashboard views
 * with a single, comprehensive overview.
 * 
 * Context data available:
 * - registrationsReport: Array of registration data
 * - deal: Current deal information
 * - userSlug: User's unique slug
 */

export default function AffillOneViewWireframe() {
  const { registrationsReport, deal, userSlug } = useOutletContext<SubsLayoutContext>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data processing
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Affill One-View Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your complete sub-affiliate overview in one place
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Deal</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deal}%</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registrations"
          value={registrationsReport?.length || 0}
          icon="👥"
          trend="+12%"
        />
        <StatCard
          title="Active Networks"
          value="Coming Soon"
          icon="🌐"
          trend="--"
        />
        <StatCard
          title="Total Earnings"
          value="Coming Soon"
          icon="💰"
          trend="--"
        />
        <StatCard
          title="Performance Score"
          value="Coming Soon"
          icon="📊"
          trend="--"
        />
      </div>

      {/* User Info */}
      {userSlug && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg p-4 border border-blue-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Your Referral Slug</p>
          <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white mt-1">
            {userSlug}
          </p>
        </div>
      )}

      {/* Wireframe Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WireframeCard
          title="📈 Performance Overview"
          description="Real-time analytics and performance metrics"
          items={["Conversion rates", "Click-through data", "Revenue trends", "Growth analytics"]}
        />
        <WireframeCard
          title="🎯 Quick Actions"
          description="Common tasks at your fingertips"
          items={["Share referral link", "View recent payouts", "Check network status", "Access marketing tools"]}
        />
        <WireframeCard
          title="🔔 Recent Activity"
          description="Latest updates and notifications"
          items={["New registrations", "Pending payouts", "System updates", "Achievement milestones"]}
        />
        <WireframeCard
          title="📚 Resources Hub"
          description="Everything you need to succeed"
          items={["Marketing materials", "Tutorial videos", "Best practices", "Support documentation"]}
        />
      </div>

      {/* Development Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🚧</span>
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
              Under Development
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
              This is a wireframe placeholder for the new unified dashboard experience. 
              The full functionality is being developed and will include interactive charts, 
              real-time data, and advanced filtering options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Supporting Components

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
          {trend}
        </span>
      </div>
      <h3 className="text-sm text-gray-600 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

interface WireframeCardProps {
  title: string;
  description: string;
  items: string[];
}

function WireframeCard({ title, description, items }: WireframeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

