interface TodoStatsProps {
  totalTodos: number;
  completedTodos: number;
  todosDueToday: number;
  overdueTodos: number;
}

export function TodoStats({ totalTodos, completedTodos, todosDueToday, overdueTodos }: TodoStatsProps) {
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
        <div className="text-sm text-gray-600">Total Tasks</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
        <div className="text-sm text-gray-600">Completed</div>
        <div className="text-xs text-gray-500">{completionRate}% completion rate</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="text-2xl font-bold text-orange-600">{todosDueToday}</div>
        <div className="text-sm text-gray-600">Due Today</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="text-2xl font-bold text-red-600">{overdueTodos}</div>
        <div className="text-sm text-gray-600">Overdue</div>
      </div>
    </div>
  );
}
