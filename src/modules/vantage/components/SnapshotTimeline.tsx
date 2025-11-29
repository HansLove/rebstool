import { useMemo } from "react";
import { Clock } from "lucide-react";
import type { VantageSnapshot } from "../types";
import { format, formatDistance } from "date-fns";

interface SnapshotTimelineProps {
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
}

export default function SnapshotTimeline({
  currentSnapshot,
  previousSnapshot,
}: SnapshotTimelineProps) {
  const timelineInfo = useMemo(() => {
    if (!currentSnapshot) return null;
    if (!previousSnapshot) {
      return {
        currentDate: format(new Date(currentSnapshot.timestamp), "MMMM dd, yyyy 'at' HH:mm"),
        previousDate: null,
        timeDifference: null,
      };
    }

    const currentDate = new Date(currentSnapshot.timestamp);
    const previousDate = new Date(previousSnapshot.timestamp);
    const timeDiff = currentDate.getTime() - previousDate.getTime();
    const timeDifference = formatDistance(previousDate, currentDate, { addSuffix: false });

    return {
      currentDate: format(currentDate, "MMMM dd, yyyy 'at' HH:mm"),
      previousDate: format(previousDate, "MMMM dd, yyyy 'at' HH:mm"),
      timeDifference,
      timeDiffMs: timeDiff,
    };
  }, [currentSnapshot, previousSnapshot]);

  if (!timelineInfo) return null;

  return (
    <div className="bg-gradient-to-r from-blue-700 to-slate-700 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Previous Snapshot */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-200" />
            <span className="text-xs font-medium text-blue-100">Previous</span>
          </div>
          {timelineInfo.previousDate ? (
            <p className="text-sm font-semibold text-white truncate">
              {timelineInfo.previousDate}
            </p>
          ) : (
            <p className="text-xs text-blue-200 italic">No previous snapshot</p>
          )}
        </div>

        {/* Current Snapshot */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-green-200" />
            <span className="text-xs font-medium text-green-100">Current</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">
            {timelineInfo.currentDate}
          </p>
        </div>

        {/* Time Difference */}
        <div className="flex-1 min-w-[150px]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-200" />
            <span className="text-xs font-medium text-yellow-100">Difference</span>
          </div>
          {timelineInfo.timeDifference ? (
            <p className="text-sm font-semibold text-white">
              {timelineInfo.timeDifference}
            </p>
          ) : (
            <p className="text-xs text-yellow-200 italic">N/A</p>
          )}
        </div>
      </div>
    </div>
  );
}

