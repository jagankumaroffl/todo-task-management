import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TodoList } from "./TodoList";
import { TodoForm } from "./TodoForm";
import { TodoFilters } from "./TodoFilters";
import { TodoStats } from "./TodoStats";

export function TodoDashboard() {
  const [activeFilter, setActiveFilter] = useState<{
    status?: "todo" | "in-progress" | "completed";
    priority?: "low" | "medium" | "high";
    sortBy?: "dueDate" | "priority" | "createdAt";
    sortOrder?: "asc" | "desc";
  }>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);

  const todos = useQuery(api.todos.getTodos, activeFilter) || [];
  const todosDueToday = useQuery(api.todos.getTodosDueToday) || [];
  const overdueTodos = useQuery(api.todos.getOverdueTodos) || [];

  const handleEditTodo = (todo: any) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <TodoStats 
        totalTodos={todos.length}
        completedTodos={todos.filter(t => t.status === "completed").length}
        todosDueToday={todosDueToday.length}
        overdueTodos={overdueTodos.length}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add New Task
        </button>
        
        <TodoFilters 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <TodoForm 
              todo={editingTodo}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Todo List */}
      <TodoList 
        todos={todos}
        onEditTodo={handleEditTodo}
      />
    </div>
  );
}
