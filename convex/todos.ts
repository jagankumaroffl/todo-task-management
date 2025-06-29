import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Helper function to get authenticated user
async function getAuthenticatedUser(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

// Get all todos for the current user
export const getTodos = query({
  args: {
    status: v.optional(v.union(v.literal("todo"), v.literal("in-progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    sortBy: v.optional(v.union(v.literal("dueDate"), v.literal("priority"), v.literal("createdAt"))),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    let query = ctx.db.query("todos");
    
    // Filter by user and shared todos
    const userTodos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const allTodosForSharing = await ctx.db.query("todos").collect();
    const sharedTodos = allTodosForSharing.filter(todo => 
      todo.sharedWith && todo.sharedWith.includes(userId)
    );
    
    let allTodos = [...userTodos, ...sharedTodos];
    
    // Apply filters
    if (args.status) {
      allTodos = allTodos.filter(todo => todo.status === args.status);
    }
    
    if (args.priority) {
      allTodos = allTodos.filter(todo => todo.priority === args.priority);
    }
    
    // Apply sorting
    if (args.sortBy) {
      allTodos.sort((a, b) => {
        let aVal = a[args.sortBy!];
        let bVal = b[args.sortBy!];
        
        if (aVal === undefined) aVal = 0;
        if (bVal === undefined) bVal = 0;
        
        if (args.sortOrder === "desc") {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    return allTodos;
  },
});

// Get todos due today
export const getTodosDueToday = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    
    const userTodos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.and(
          q.gte(q.field("dueDate"), startOfDay),
          q.lt(q.field("dueDate"), endOfDay)
        )
      )
      .collect();
    
    return userTodos;
  },
});

// Get overdue todos
export const getOverdueTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    const now = Date.now();
    
    const userTodos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.and(
          q.lt(q.field("dueDate"), now),
          q.neq(q.field("status"), "completed")
        )
      )
      .collect();
    
    return userTodos;
  },
});

// Create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const now = Date.now();
    
    if (args.title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
    
    if (args.title.length > 200) {
      throw new Error("Title cannot exceed 200 characters");
    }
    
    if (args.description && args.description.length > 1000) {
      throw new Error("Description cannot exceed 1000 characters");
    }
    
    return await ctx.db.insert("todos", {
      title: args.title.trim(),
      description: args.description?.trim(),
      status: "todo" as const,
      dueDate: args.dueDate,
      priority: args.priority,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("todo"), v.literal("in-progress"), v.literal("completed"))),
    dueDate: v.optional(v.number()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    // Check if user owns the todo or has it shared with them
    const canEdit = todo.userId === userId || (todo.sharedWith && todo.sharedWith.includes(userId));
    if (!canEdit) {
      throw new Error("Not authorized to edit this todo");
    }
    
    const updates: any = { updatedAt: Date.now() };
    
    if (args.title !== undefined) {
      if (args.title.trim().length === 0) {
        throw new Error("Title cannot be empty");
      }
      if (args.title.length > 200) {
        throw new Error("Title cannot exceed 200 characters");
      }
      updates.title = args.title.trim();
    }
    
    if (args.description !== undefined) {
      if (args.description.length > 1000) {
        throw new Error("Description cannot exceed 1000 characters");
      }
      updates.description = args.description.trim();
    }
    
    if (args.status !== undefined) {
      updates.status = args.status;
    }
    
    if (args.dueDate !== undefined) {
      updates.dueDate = args.dueDate;
    }
    
    if (args.priority !== undefined) {
      updates.priority = args.priority;
    }
    
    await ctx.db.patch(args.id, updates);
  },
});

// Delete a todo
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    // Only the owner can delete the todo
    if (todo.userId !== userId) {
      throw new Error("Not authorized to delete this todo");
    }
    
    await ctx.db.delete(args.id);
  },
});

// Share a todo with another user
export const shareTodo = mutation({
  args: {
    todoId: v.id("todos"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      throw new Error("Todo not found");
    }
    
    if (todo.userId !== userId) {
      throw new Error("Not authorized to share this todo");
    }
    
    // Find user by email
    const userToShare = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.userEmail))
      .unique();
    
    if (!userToShare) {
      throw new Error("User not found");
    }
    
    if (userToShare._id === userId) {
      throw new Error("Cannot share todo with yourself");
    }
    
    const currentSharedWith = todo.sharedWith || [];
    if (currentSharedWith.includes(userToShare._id)) {
      throw new Error("Todo is already shared with this user");
    }
    
    await ctx.db.patch(args.todoId, {
      sharedWith: [...currentSharedWith, userToShare._id],
      updatedAt: Date.now(),
    });
  },
});

// Search todos
export const searchTodos = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    
    if (args.searchTerm.trim().length === 0) {
      return [];
    }
    
    const results = await ctx.db
      .query("todos")
      .withSearchIndex("search_todos", (q) =>
        q.search("title", args.searchTerm).eq("userId", userId)
      )
      .take(20);
    
    return results;
  },
});
