# Todo Task Management App

A full-stack Todo Task Management application built with [Chef](https://chef.convex.dev) using [Convex](https://convex.dev) as its backend. Features social authentication, real-time collaboration, and comprehensive task management capabilities.

This project is connected to the Convex deployment named [`sleek-spider-679`](https://dashboard.convex.dev/d/sleek-spider-679).

## 🚀 Live Demo

- **Frontend**: https://sleek-spider-679.convex.app/
- **Backend API**: Convex Backend (sleek-spider-679)

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Assumptions](#assumptions)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## 📁 Project Structure

```
todo-task-management/
├── app/                    # Frontend code (Vite + React)
│   ├── src/
│   ├── public/
│   └── package.json
├── convex/                 # Backend code (Convex)
│   ├── schema.ts          # Database schema
│   ├── functions/         # Server functions
│   ├── router.ts          # HTTP API routes
│   ├── http.ts            # HTTP configuration
│   └── auth.config.ts     # Authentication config
└── README.md
```

The frontend code is in the `app` directory and is built with [Vite](https://vitejs.dev/).

The backend code is in the `convex` directory using Convex as the backend-as-a-service platform.

## ✨ Features

### Authentication
- Social login integration (Google/GitHub/Facebook)
- JWT-based session management
- Secure OAuth 2.0 implementation

### Task Management
- **CRUD Operations**: Create, read, update, delete tasks
- **Task Sharing**: Share tasks with other users via email/username
- **Real-time Updates**: Live task updates using WebSockets/Server-Sent Events
- **Task Filtering**: Filter by status, priority, due date, shared tasks
- **Task Status**: Mark tasks as complete, in-progress, or pending

### User Experience
- **Responsive Design**: Optimized for desktop and mobile
- **Real-time Notifications**: Toast messages for user actions
- **Offline Support**: Basic offline functionality
- **Error Handling**: Comprehensive error boundaries
- **Pagination**: Efficient task loading with pagination and sorting

### Performance & Security
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Server-side validation for all inputs
- **Error Boundaries**: Graceful error handling in React

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching and caching
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form management
- **React Router** - Client-side routing

### Backend
- **Convex** - Backend-as-a-Service platform
- **TypeScript** - Type-safe development
- **Convex Auth** - Authentication system
- **Real-time Subscriptions** - Built-in real-time updates
- **Server Functions** - Serverless backend functions
- **HTTP API** - RESTful endpoints via Convex router

### Database
- **Convex Database** - Built-in document database with ACID transactions
- **Real-time Queries** - Automatic query subscriptions

### Deployment
- **Frontend**: Vercel/Netlify (Vite build)
- **Backend**: Convex Cloud (Automatic deployment)
- **Database**: Convex (Managed database)

### System Components

1. **Client Layer**: React frontend built with Vite
2. **Authentication Layer**: Convex Auth with Anonymous/Social login
3. **API Layer**: Convex functions with built-in real-time subscriptions
4. **Business Logic Layer**: Server functions for task management
5. **Data Layer**: Convex database with automatic indexing
6. **External Services**: Social login providers (optional)

### Data Flow
1. User authenticates via Convex Auth (Anonymous or Social)
2. Authentication state managed by Convex Auth
3. Client calls Convex functions (queries/mutations)
4. Real-time updates automatically pushed to subscribed clients
5. Data persisted in Convex database with ACID guarantees

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Convex account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jagankumaroffl/todo-task-management.git
cd todo-task-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Convex**
```bash
npx convex dev
# This will prompt you to log in to Convex and set up your deployment
```

4. **Run the application**
```bash
npm run dev
```

This single command will start both the frontend (Vite) and backend (Convex) servers.

The application will be available at `http://localhost:5173` (Vite's default port)

## 🔐 Authentication

This app uses [Convex Auth](https://auth.convex.dev/) for user authentication. By default, it's configured with Anonymous authentication for easy development and testing. You can easily add social login providers:

### Adding Social Login
1. Configure providers in `convex/auth.config.ts`
2. Add provider credentials to your Convex environment variables
3. Update the frontend login components

### Supported Providers
- Google OAuth
- GitHub OAuth  
- Facebook OAuth
- Anonymous (default)

## 📚 API Documentation

### Convex Functions

**Queries (Read Operations)**
```typescript
// Get user tasks with filters and pagination
api.tasks.list({ filter, limit, cursor })

// Get specific task
api.tasks.get({ taskId })

// Get shared tasks
api.tasks.getShared()

// Get current user
api.users.current()
```

**Mutations (Write Operations)**
```typescript
// Create new task
api.tasks.create({ title, description, priority, dueDate })

// Update task
api.tasks.update({ taskId, ...updates })

// Delete task
api.tasks.remove({ taskId })

// Share task with user
api.tasks.share({ taskId, userEmail })

// Toggle task completion
api.tasks.toggleComplete({ taskId })
```

### HTTP API Routes

User-defined HTTP routes are defined in the `convex/router.ts` file:

```typescript
// External API endpoints (if needed)
GET  /api/tasks - Public task API
POST /api/webhooks - External webhooks
```

### Real-time Updates

Convex provides automatic real-time subscriptions. When you use `useQuery()` in your React components, they automatically update when data changes:

```javascript
// Automatically receives real-time updates
const tasks = useQuery(api.tasks.list, { filter: "pending" });
```

## 🔧 Environment Variables

### Convex Environment Variables
Set these in your Convex dashboard or using the Convex CLI:

```bash
# Set environment variables in Convex
npx convex env set SITE_URL https://your-frontend-url.com

# For social authentication (optional)
npx convex env set AUTH_GOOGLE_ID your_google_client_id
npx convex env set AUTH_GOOGLE_SECRET your_google_client_secret
npx convex env set AUTH_GITHUB_ID your_github_client_id  
npx convex env set AUTH_GITHUB_SECRET your_github_client_secret
```

### Frontend Environment Variables (.env.local)
```env
# Convex deployment URL (automatically set by `npx convex dev`)
VITE_CONVEX_URL=https://sleek-spider-679.convex.cloud

# Optional: Custom environment variables
VITE_APP_NAME=Todo Task Manager
VITE_ENABLE_ANALYTICS=false
```

> **Note**: Convex automatically manages most environment variables. The `VITE_CONVEX_URL` is set automatically when you run `npx convex dev`.

## 🚀 Deployment

### Frontend Deployment (Vite App)
1. **Build the application**
```bash
npm run build
```

2. **Deploy to Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Or deploy to Netlify**
```bash
# Build folder: dist
# Build command: npm run build
```

### Backend Deployment (Convex)
Convex backend is automatically deployed when you push functions:

```bash
# Deploy to production
npx convex deploy --prod

# The backend URL will be: https://sleek-spider-679.convex.cloud
```

### Database
- **No separate database setup needed** - Convex includes a managed database
- **Automatic backups and scaling**
- **ACID transactions** built-in
- **Automatic indexing** for query optimization

Check out the [Convex docs](https://docs.convex.dev/) for more information on deployment and hosting:
* [Hosting and Deployment](https://docs.convex.dev/production/) - Complete deployment guide
* [Best Practices](https://docs.convex.dev/understanding/best-practices/) - Performance optimization tips

## 📝 Assumptions

Based on the requirements, I made the following assumptions:

1. **User Management**: Users are automatically created upon first authentication (Anonymous or Social)
2. **Task Sharing**: Tasks can be shared with users by email address, creating collaborative access
3. **Real-time Updates**: All users viewing tasks receive automatic real-time updates via Convex subscriptions
4. **Task Priority**: Tasks have three priority levels (Low, Medium, High)
5. **Task Status**: Tasks have four status types (Pending, In Progress, Completed, Cancelled)
6. **Offline Support**: Basic offline support through Convex's built-in caching mechanisms
7. **Authentication**: Default to Anonymous authentication for easy onboarding, with optional social login
8. **Data Persistence**: All data stored in Convex's managed database with automatic backups
9. **Due Date Management**: Tasks support due dates with visual indicators for overdue items
10. **Pagination**: Tasks are paginated automatically by Convex queries for optimal performance
11. **Rate Limiting**: Convex provides built-in rate limiting and DDoS protection
12. **File Attachments**: Tasks can optionally support file attachments using Convex file storage

## 🎯 Key Features Demo

### Authentication Flow
- Seamless social login integration
- Secure JWT token management
- Automatic user profile creation

### Task Management
- Intuitive task creation and editing
- Advanced filtering and sorting options
- Real-time collaborative features

### User Experience
- Responsive design across all devices
- Smooth animations and transitions
- Comprehensive error handling

## 🔍 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
# Test Convex functions
npx convex test

# Run function in isolation
npx convex run tasks:create --arg '{"title":"Test Task"}'
```

## 📈 Performance Optimizations

- **Frontend**: Vite's fast HMR, code splitting, lazy loading with React.lazy()
- **Backend**: Convex's automatic query optimization and caching
- **Real-time**: Efficient subscription management with automatic cleanup
- **Database**: Automatic indexing and query optimization by Convex
- **CDN**: Static assets served via Convex's global CDN

## 🛡 Security Features

- **Authentication**: Secure token management via Convex Auth
- **Input Validation**: Server-side validation in Convex functions
- **CORS**: Automatically configured by Convex
- **Rate Limiting**: Built-in DDoS protection
- **Data Security**: Automatic encryption at rest and in transit

## 📖 Additional Resources

### Convex Documentation
- [Convex Overview](https://docs.convex.dev/understanding/) - Learn Convex fundamentals
- [Convex Auth Guide](https://auth.convex.dev/) - Authentication setup and configuration  
- [Database Queries](https://docs.convex.dev/database/reading-data) - Advanced querying techniques
- [Real-time Subscriptions](https://docs.convex.dev/client/react) - React integration patterns

### HTTP API
User-defined HTTP routes are defined in the `convex/router.ts` file. We split these routes into a separate file from `convex/http.ts` to allow us to prevent the LLM from modifying the authentication routes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

This project is a part of a hackathon run by https://www.katomaran.com