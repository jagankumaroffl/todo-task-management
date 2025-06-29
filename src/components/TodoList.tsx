import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface Todo {
  _id: Id<"todos">;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  dueDate?: number;
  priority: "low" | "medium" | "high";
  userId: Id<"users">;
  sharedWith?: Id<"users">[];
  createdAt: number;
  updatedAt: number;
}

interface TodoListProps {
  todos: Todo[];
  onEditTodo: (todo: Todo) => void;
}

export function TodoList({ todos, onEditTodo }: TodoListProps) {
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleStatusChange = async (todoId: Id<"todos">, newStatus: Todo["status"]) => {
    try {
      await updateTodo({ id: todoId, status: newStatus });
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (todoId: Id<"todos">) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTodo({ id: todoId });
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "in-progress": return "text-blue-600 bg-blue-50";
      case "todo": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString();
  };

  const isOverdue = (dueDate?: number) => {
    if (!dueDate) return false;
    return dueDate < Date.now();
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${
            todo.status === "completed" ? "opacity-75" : ""
          } ${isOverdue(todo.dueDate) && todo.status !== "completed" ? "border-red-200" : ""}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={todo.status === "completed"}
                  onChange={(e) => 
                    handleStatusChange(todo._id, e.target.checked ? "completed" : "todo")
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <h3 className={`font-medium ${todo.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {todo.title}
                </h3>
              </div>
              
              {todo.description && (
                <p className="text-gray-600 text-sm mb-3 ml-7">{todo.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 ml-7">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                  {todo.priority} priority
                </span>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
                  {todo.status.replace("-", " ")}
                </span>
                
                {todo.dueDate && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOverdue(todo.dueDate) && todo.status !== "completed" 
                      ? "text-red-600 bg-red-50" 
                      : "text-gray-600 bg-gray-50"
                  }`}>
                    Due: {formatDate(todo.dueDate)}
                  </span>
                )}
                
                {todo.sharedWith && todo.sharedWith.length > 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-50">
                    Shared
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {todo.status !== "completed" && (
                <select
                  value={todo.status}
                  onChange={(e) => handleStatusChange(todo._id, e.target.value as Todo["status"])}
                  className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}
              
              <button
                onClick={() => onEditTodo(todo)}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Edit task"
              >
                ✏️
              </button>
              
              <button
                onClick={() => handleDelete(todo._id)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
