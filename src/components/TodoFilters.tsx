interface TodoFiltersProps {
  activeFilter: {
    status?: "todo" | "in-progress" | "completed";
    priority?: "low" | "medium" | "high";
    sortBy?: "dueDate" | "priority" | "createdAt";
    sortOrder?: "asc" | "desc";
  };
  onFilterChange: (filter: any) => void;
}

export function TodoFilters({ activeFilter, onFilterChange }: TodoFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({
      ...activeFilter,
      [key]: value === "all" ? undefined : value,
    });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Status:</label>
        <select
          value={activeFilter.status || "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Priority:</label>
        <select
          value={activeFilter.priority || "all"}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Sort by:</label>
        <select
          value={activeFilter.sortBy || "createdAt"}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Order:</label>
        <select
          value={activeFilter.sortOrder || "desc"}
          onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <button
        onClick={() => onFilterChange({ sortBy: "createdAt", sortOrder: "desc" })}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Clear Filters
      </button>
    </div>
  );
}
