import React from "react";
import { BarChart3 } from "lucide-react";

const UsageAnalyticsSummary = ({ stats }) => {
  const successRate =
    stats.total_requests > 0
      ? ((stats.successful_generations / stats.total_requests) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-1">
        <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
        Usage Analytics
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Overall AI generation performance.
      </p>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400">
              Success Rate
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {successRate}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Successful
            </p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {stats.successful_generations?.toLocaleString() || 0}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {stats.failed_generations?.toLocaleString() || 0}
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Total Requests
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.total_requests?.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalyticsSummary;
