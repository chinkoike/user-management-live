import React from "react";

const TaskSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-40" />
        <div className="h-10 bg-slate-200 rounded w-28" />
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border rounded-lg bg-white"
          >
            <div className="h-5 w-5 bg-slate-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        <div className="h-8 w-8 bg-slate-200 rounded" />
        <div className="h-8 w-8 bg-slate-200 rounded" />
        <div className="h-8 w-8 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export default TaskSkeleton;
