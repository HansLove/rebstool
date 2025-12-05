import { useState, useMemo, useEffect } from 'react';
import { useVantageScraper } from '../hooks/useVantageScraper';
import useAuth from '@/core/hooks/useAuth';
import { RefreshCw, AlertCircle, Users, TrendingDown, DollarSign, Clock, Calendar } from 'lucide-react';
import type { VantageCredentials, RetailClient, Account, VantageSnapshot } from '../types';
import MetricCard from './dashboard/MetricCard';
import UserRow from './dashboard/UserRow';
import CentralSearch from './dashboard/CentralSearch';
import UserInfoModal from './dashboard/UserInfoModal';
import RebatesTable from './dashboard/RebatesTable';
import RebatesKPIs from './dashboard/RebatesKPIs';
import TopAtRiskUsers from './dashboard/TopAtRiskUsers';
import MiniJournal from './dashboard/MiniJournal';
import CommunityMetrics from './dashboard/CommunityMetrics';
import NetFunding from './dashboard/NetFunding';
import { useUserTabs } from '../context/UserTabsContext';
import { getRebatesWithStatus, type RebateWithStatus } from '../utils/rebateStatus';
import SnapshotTimeline from './dashboard/SnapshotTimeline';

export default function Dashboard() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;

  const {
    currentSnapshot,
    previousSnapshot,
    comparisonResult,
    isLoading,
    error,
    runScraper,
    snapshots,
    selectSnapshotForComparison,
    resetToLatest,
  } = useVantageScraper();

  const [credentials] = useState<VantageCredentials>({
    username: '',
    password: '',
  });

  const [expandedSections, setExpandedSections] = useState<{
    disappeared: boolean;
    lostMoney: boolean;
    withdrawals: boolean;
  }>({
    disappeared: false,
    lostMoney: false,
    withdrawals: false,
  });

  // Snapshot range toggle - will be calculated based on available snapshots
  const [snapshotRange, setSnapshotRange] = useState<string | null>(null);

  // User tabs from context
  const { addTab, getActiveTab, removeTab } = useUserTabs();

  // Calculate users who lost significant money (>$500 loss)
  const usersWhoLostMoney = useMemo(() => {
    if (!comparisonResult) return [];
    return comparisonResult.changedUsers
      .filter(changedUser => {
        const equityChange = changedUser.changes.find(c => c.field === 'equity');
        if (!equityChange) return false;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        const loss = oldEquity - newEquity;
        return loss > 500 && oldEquity > 100;
      })
      .map(changedUser => {
        const equityChange = changedUser.changes.find(c => c.field === 'equity')!;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        return {
          ...changedUser.user,
          loss: oldEquity - newEquity,
          oldEquity,
          newEquity,
        };
      })
      .sort((a, b) => b.loss - a.loss);
  }, [comparisonResult]);

  // Calculate critical withdrawals (>$1000 withdrawn)
  const criticalWithdrawals = useMemo(() => {
    if (!comparisonResult) return [];
    return comparisonResult.changedUsers
      .filter(changedUser => {
        const equityChange = changedUser.changes.find(c => c.field === 'equity');
        if (!equityChange) return false;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        const withdrawal = oldEquity - newEquity;
        return withdrawal > 1000 && oldEquity > 1000;
      })
      .map(changedUser => {
        const equityChange = changedUser.changes.find(c => c.field === 'equity')!;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        return {
          ...changedUser.user,
          withdrawal: oldEquity - newEquity,
          oldEquity,
          newEquity,
        };
      })
      .sort((a, b) => b.withdrawal - a.withdrawal);
  }, [comparisonResult]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Calculate time difference between snapshots
  const timeDifference = useMemo(() => {
    if (!currentSnapshot || !previousSnapshot) return null;

    const diffMs = currentSnapshot.timestamp - previousSnapshot.timestamp;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      const remainingHours = diffHours % 24;
      if (remainingHours > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
      }
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      const remainingMinutes = diffMinutes % 60;
      if (remainingMinutes > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''}`;
    }
  }, [currentSnapshot, previousSnapshot]);

  // Calculate rebates with status (must be before early return)
  const rebatesWithStatus = useMemo(() => {
    return getRebatesWithStatus(currentSnapshot, previousSnapshot);
  }, [currentSnapshot, previousSnapshot]);

  // Filter snapshots for 24h and 7d calculations
  const snapshots24h = useMemo(() => {
    if (!currentSnapshot) return [];
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    return snapshots.filter(s => s.timestamp >= twentyFourHoursAgo && s.id !== currentSnapshot.id);
  }, [snapshots, currentSnapshot]);

  const snapshots7d = useMemo(() => {
    if (!currentSnapshot) return [];
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    return snapshots.filter(s => s.timestamp >= sevenDaysAgo && s.id !== currentSnapshot.id);
  }, [snapshots, currentSnapshot]);

  const snapshots30d = useMemo(() => {
    if (!currentSnapshot) return [];
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    return snapshots.filter(s => s.timestamp >= thirtyDaysAgo && s.id !== currentSnapshot.id);
  }, [snapshots, currentSnapshot]);

  // Calculate available snapshot ranges based on actual snapshots
  const availableRanges = useMemo(() => {
    if (!currentSnapshot || snapshots.length === 0) return [];

    const now = Date.now();
    const ranges: Array<{ label: string; days: number; snapshot: VantageSnapshot | null }> = [];

    // Always include "Latest" (most recent comparison)
    ranges.push({
      label: 'Latest',
      days: 0,
      snapshot: snapshots[1] || null, // Second most recent
    });

    // Check for snapshots at different time ranges
    const timeRanges = [
      { label: '1d', days: 1 },
      { label: '2d', days: 2 },
      { label: '3d', days: 3 },
      { label: '7d', days: 7 },
      { label: '14d', days: 14 },
      { label: '30d', days: 30 },
    ];

    timeRanges.forEach(({ label, days }) => {
      const timeAgo = now - days * 24 * 60 * 60 * 1000;
      // Find the closest snapshot before this time
      const snapshotsInRange = snapshots.filter(
        s => s.timestamp <= timeAgo && s.id !== currentSnapshot.id
      );

      if (snapshotsInRange.length > 0) {
        // Get the closest snapshot to the target time
        const closestSnapshot = snapshotsInRange.reduce((closest, current) => {
          const closestDiff = Math.abs(closest.timestamp - timeAgo);
          const currentDiff = Math.abs(current.timestamp - timeAgo);
          return currentDiff < closestDiff ? current : closest;
        });

        ranges.push({
          label,
          days,
          snapshot: closestSnapshot,
        });
      }
    });

    return ranges;
  }, [snapshots, currentSnapshot]);

  // Set default range to "Latest" when snapshots are available
  useEffect(() => {
    if (availableRanges.length > 0 && snapshotRange === null) {
      setSnapshotRange('Latest');
    }
  }, [availableRanges, snapshotRange]);

  // Handle snapshot range selection
  const handleSnapshotRangeSelect = (rangeLabel: string) => {
    setSnapshotRange(rangeLabel);
    const selectedRange = availableRanges.find(r => r.label === rangeLabel);
    
    if (selectedRange?.snapshot) {
      // Automatically select the snapshot for comparison
      selectSnapshotForComparison(selectedRange.snapshot.id);
    } else if (rangeLabel === 'Latest') {
      // Reset to latest comparison
      resetToLatest();
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-9xl mx-auto w-full px-4 py-8 lg:px-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">Access Denied</h2>
              <p className="text-red-700 dark:text-red-300">This feature is only available for administrators.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRunScraper = async () => {
    const creds = credentials.username && credentials.password ? credentials : undefined;
    await runScraper(creds);
  };

  // Format date in London timezone
  const formatDateLondon = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: false,
    }).format(date);
  };

  // Find account for a user
  const findAccountForUser = (userId: number): Account | undefined => {
    if (!currentSnapshot) return undefined;
    return currentSnapshot.accounts.find(acc => acc.userId === userId);
  };

  // Handle user click - open in tab
  const handleUserClick = (user: RetailClient) => {
    const account = findAccountForUser(user.userId);
    addTab(user, account);
  };

  // Get active tab
  const activeTab = getActiveTab();

  // Handle rebate click - find associated user and open tab
  const handleRebateClick = (rebate: RebateWithStatus) => {
    if (!currentSnapshot) return;

    // Find the retail client associated with this rebate account
    const allClients = currentSnapshot.retailResults.flatMap(result => result.retail?.data || []);
    const associatedUser = allClients.find(client => client.userId === rebate.userId);

    if (associatedUser) {
      addTab(associatedUser, rebate);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (activeTab) {
      const tabId = `user-${activeTab.user.userId}`;
      removeTab(tabId);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-2 lg:px-3">
      {/* Header */}
      <div className="sticky top-0 z-50 -mx-2 mb-3 border-b border-gray-200 bg-white px-2 py-2 shadow-sm lg:-mx-3 lg:px-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex-1">
            {/* <h1 className="text-xl font-bold text-gray-900 dark:text-white">Live Rebates Control Panel</h1> */}
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {currentSnapshot?.timestamp && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last capture:{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatDateLondon(currentSnapshot.timestamp)}
                  </span>{' '}
                  (London)
                </p>
              )}
              {timeDifference && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Time between snapshots:{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{timeDifference}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Snapshot Range Toggle - Based on Available Snapshots */}
            {availableRanges.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div className="flex gap-1">
                  {availableRanges.map(range => (
                    <button
                      key={range.label}
                      onClick={() => handleSnapshotRangeSelect(range.label)}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        snapshotRange === range.label
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                      title={
                        range.snapshot
                          ? `Compare with snapshot from ${new Date(range.snapshot.timestamp).toLocaleString()}`
                          : 'Compare with latest'
                      }
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleRunScraper}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Capturing...' : 'Capture Snapshot'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">Error</p>
              <p className="text-xs text-red-700 dark:text-red-300">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Central Search - Full Width */}
      <div className="mb-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <CentralSearch currentSnapshot={currentSnapshot} onUserClick={handleUserClick} />
        </div>
      </div>

      {/* Priority Alert Cards - Client Requests */}
      <div className="mb-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* 1. Disappeared Users */}
          <MetricCard
            title="Disappeared Users"
            count={comparisonResult?.removedUsers?.length || 0}
            icon={<Users className="h-5 w-5" />}
            color="red"
            isExpanded={expandedSections.disappeared}
            onToggle={() => toggleSection('disappeared')}
          >
            {comparisonResult && comparisonResult.removedUsers.length > 0 ? (
              <div className="space-y-2">
                {comparisonResult.removedUsers.map(user => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    metric={`Equity: ${formatCurrency(user.equity)}`}
                    onClick={handleUserClick}
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No users disappeared</p>
            )}
          </MetricCard>

          {/* 2. Users Who Lost Money */}
          <MetricCard
            title="Significant Losses"
            count={usersWhoLostMoney.length}
            icon={<TrendingDown className="h-5 w-5" />}
            color="orange"
            isExpanded={expandedSections.lostMoney}
            onToggle={() => toggleSection('lostMoney')}
          >
            {usersWhoLostMoney.length > 0 ? (
              <div className="space-y-2">
                {usersWhoLostMoney.map(user => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    metric={`Loss: ${formatCurrency(user.loss)}`}
                    subMetric={`${formatCurrency(user.oldEquity)} → ${formatCurrency(user.newEquity)}`}
                    onClick={handleUserClick}
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No significant losses detected
              </p>
            )}
          </MetricCard>

          {/* 3. Critical Withdrawals */}
          <MetricCard
            title="Critical Withdrawals"
            count={criticalWithdrawals.length}
            icon={<DollarSign className="h-5 w-5" />}
            color="purple"
            isExpanded={expandedSections.withdrawals}
            onToggle={() => toggleSection('withdrawals')}
          >
            {criticalWithdrawals.length > 0 ? (
              <div className="space-y-2">
                {criticalWithdrawals.map(user => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    metric={`Withdrawn: ${formatCurrency(user.withdrawal)}`}
                    subMetric={`${formatCurrency(user.oldEquity)} → ${formatCurrency(user.newEquity)}`}
                    onClick={handleUserClick}
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No critical withdrawals detected
              </p>
            )}
          </MetricCard>
        </div>
      </div>

      {/* Top 3 Users at Risk and Mini Journal - Priority Section */}
      <div className="mb-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Top 3 Users at Risk - 2/3 width */}
          <div className="lg:col-span-2">
            <TopAtRiskUsers
              usersWhoLostMoney={usersWhoLostMoney}
              criticalWithdrawals={criticalWithdrawals}
              disappearedUsers={comparisonResult?.removedUsers || []}
              onUserClick={handleUserClick}
            />
          </div>
          {/* Mini Journal - 1/3 width */}
          <div className="lg:col-span-1">
            <MiniJournal />
          </div>
        </div>
      </div>

      {/* Rebates Table */}
      {/* <div className="mb-3">
        <RebatesTable rebates={rebatesWithStatus} onRebateClick={handleRebateClick} />
      </div> */}

      {/* Rebates KPIs Panel - Secondary Information */}
      <div className="mb-3">
        <RebatesKPIs
          currentSnapshot={currentSnapshot}
          previousSnapshot={previousSnapshot}
          snapshots24h={snapshots24h}
          snapshots7d={snapshots7d}
        />
      </div>

      {/* Community Metrics & Net Funding */}
      <div className="mb-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <CommunityMetrics
            currentSnapshot={currentSnapshot}
            snapshots24h={snapshots24h}
            snapshots7d={snapshots7d}
            snapshots30d={snapshots30d}
            onUserClick={userId => {
              if (!currentSnapshot) return;
              const allClients = currentSnapshot.retailResults.flatMap(result => result.retail?.data || []);
              const user = allClients.find(c => c.userId === userId);
              if (user) {
                handleUserClick(user);
              }
            }}
          />
          <NetFunding
            currentSnapshot={currentSnapshot}
            previousSnapshot={previousSnapshot}
            snapshots30d={snapshots30d}
            onUserClick={userId => {
              if (!currentSnapshot) return;
              const allClients = currentSnapshot.retailResults.flatMap(result => result.retail?.data || []);
              const user = allClients.find(c => c.userId === userId);
              if (user) {
                handleUserClick(user);
              }
            }}
          />
        </div>
      </div>

      {/* Snapshot Timeline - Calendar View */}
      <div className="mb-3">
        <SnapshotTimeline
          snapshots={snapshots}
          currentSnapshot={currentSnapshot}
          previousSnapshot={previousSnapshot}
          onSnapshotSelect={selectSnapshotForComparison}
          onResetToLatest={resetToLatest}
        />
      </div>

      {/* No Data State */}
      {!currentSnapshot && !isLoading && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <Users className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">No Snapshots Yet</h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Capture your first snapshot to start tracking changes.
          </p>
        </div>
      )}

      {/* User Info Modal */}
      {activeTab && (
        <UserInfoModal
          user={activeTab.user}
          account={activeTab.account}
          isOpen={!!activeTab}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
