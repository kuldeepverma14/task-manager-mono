# Full-Stack Task Management Assessment

This project consists of a high-performance **Backend API** and a **Web Frontend Dashboard** built with modern tech stacks and industry best practices.

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js (v18+)
- Docker (optional, but recommended for Database)
- PostgreSQL (if not using Docker)

---

## 🛠 Backend API (Node.js + TS + Prisma 7)
Located in `/task-manager-api`

### Setup Instructions
1.  **Navigate to directory**: `cd task-manager-api`
2.  **Install dependencies**: `npm install`
3.  **Setup Database**:
    -   Ensure PostgreSQL is running locally.
    -   Update `.env` with your `DATABASE_URL`.
4.  **Configuration**: Prisma 7 now uses `prisma.config.ts` for database connection instead of inside `schema.prisma`.
5.  **Sync Database**: `npx prisma db push`
6.  **Generate Prisma Client**: `npx prisma generate`
7.  **Start Development Server**: `npm run dev`

### Key Features
- **Security**: JWT authentication with Access (Short) and Refresh (Long) tokens.
- **Token Rotation**: Implemented for refresh tokens to support multiple active sessions.
- **Prisma 7 Ready**: Modular schema and config setup.
- **Validation**: Strict input validation using **Zod**.
- **Error Handling**: Centralized global error middleware with standard HTTP codes.

---

## 💻 Web Frontend (Next.js + TS + Redux Toolkit)
Located in `/task-manager-web`

### Setup Instructions
1.  **Navigate to directory**: `cd task-manager-web`
2.  **Install dependencies**: `npm install`
3.  **Configure API URL**: Update `NEXT_PUBLIC_API_URL` in `.env`.
4.  **Start Dashboard**: `npm run dev`

### Key Features
- **State Management**: **Redux Toolkit (RTK)** for centralized app state.
- **Data Fetching**: **RTK Query** with automatic cache invalidation and tag syncing.
- **Auth Persistence**: Credentials stored securely in `authSlice` and synchronized with `LocalStorage`.
- **API Interceptor**: Middleware-based token refresh logic using Redux thunks/queries.
- **Responsive Design**: Premium mobile-first UI with **Lucide Icons** and **Framer Motion**.
- **Notifications**: Real-time toast feedback for all CRUD operations.


---

## ✅ Assessment Checklist
- [x] Node.js + TypeScript
- [x] PostgreSQL with Prisma
- [x] JWT Access/Refresh tokens
- [x] Task CRUD with Pagination/Filter/Search
- [x] Next.js App Router
- [x] Responsive Design & Toasts
- [x] Clean Error Handling & Project Structure
