# ProjectManager — CodeAlpha Task 3: Project Management Tool

**ProjectManager** is a modern, collaborative project-management web application inspired by Trello and Asana. It enables authenticated teams to create group projects, invite and manage members, organize tasks on interactive Kanban boards with drag-and-drop mechanics, assign tasks, and collaborate through real-time threaded comments.

---

## 🌟 Key Features

1. **Clerk Authentication & Identity Management**:
   - Secure registration, login, session persistence, and profile management via Clerk SDK.
   - Protected routes and authorization middleware ensuring only project members/owners access sensitive project data.
   - User profile synchronization between Clerk identity and Supabase PostgreSQL.

2. **Group Projects & Workspace Management**:
   - Create projects with custom titles and scope descriptions.
   - Creator is automatically granted the `owner` role.
   - Add collaborators by email with granular roles (`owner`, `admin`, `member`).
   - Project overview metrics (active tasks count, progress bars, member avatars).

3. **Interactive Kanban Board**:
   - 3 Column Workflow: **To Do**, **In Progress**, **Done**.
   - HTML5 Drag-and-Drop support with optimistic UI updates and real-time state synchronization.
   - Task cards showing priority badges (Low, Medium, High), due dates, assignee info, and comment counts.
   - Real-time search by task title/description and multi-criteria filters (Priority, Assignee).

4. **Task Assignment & Details**:
   - Rich task creation and update modal with title, description, priority, due date, and member assignment.
   - Automatic assignment validation ensuring only authorized project members can be assigned.

5. **Task Comments & Communication**:
   - Threaded comments per task in chronological order.
   - Author profile badge and timestamp.
   - Permission control: users can delete their own comments, and project owners can moderate discussions.

6. **Real-time Collaboration (Bonus)**:
   - Socket.io event broadcasting for task creation, status updates, moves, comments, and member changes.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Bootstrap 5, Lucide Icons, Plus Jakarta Sans, Custom CSS |
| **Backend** | Node.js, Express.js (REST API) |
| **Authentication** | Clerk (`@clerk/clerk-react`, `@clerk/backend`) |
| **Database** | Supabase PostgreSQL (`@supabase/supabase-js`) |
| **Real-time** | Socket.io (`socket.io`, `socket.io-client`) |
| **API Client** | Axios (with automatic Bearer token interceptor) |
| **Testing** | Jest, Supertest |

---

## 📁 Project Structure

```
CodeAlpha_ProjectManager/
├── backend/
│   ├── src/
│   │   ├── config/             # Supabase client, Clerk config, env config
│   │   ├── controllers/        # Project, task, comment, member, user controllers
│   │   ├── middleware/         # AuthMiddleware (Clerk JWT validation), errorHandler
│   │   ├── routes/             # REST endpoints (/api/projects, /api/tasks, etc.)
│   │   ├── services/           # Business logic & Supabase database services
│   │   ├── sockets/            # Socket.io event handlers
│   │   └── server.js           # Express app & Socket.io server bootstrap
│   ├── tests/
│   │   └── api.test.js         # Automated Jest + Supertest integration tests
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API client
│   │   ├── components/         # Navbar, ProjectCard, BoardColumn, TaskCard, TaskModal, MemberModal
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── pages/              # LandingPage, DashboardPage, ProjectBoardPage, ProfilePage, SignIn, SignUp
│   │   ├── styles/             # Custom styling & Kanban animations
│   │   ├── App.jsx             # React router & ClerkProvider
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── supabase/
│   ├── schema.sql              # Database schema with tables, constraints, indexes
│   └── seed.sql                # Demo seed data
├── README.md
└── package.json                # Root package.json with concurrent dev runner
```

---

## 🗄️ Database Model (Supabase PostgreSQL)

```sql
-- user_profiles
id (UUID), clerk_user_id (TEXT UNIQUE), name (TEXT), email (TEXT), avatar_url (TEXT), created_at (TIMESTAMPTZ)

-- projects
id (UUID), name (TEXT), description (TEXT), owner_id (TEXT), status (TEXT), created_at (TIMESTAMPTZ)

-- project_members
id (UUID), project_id (UUID FK), user_id (TEXT), role (TEXT: owner/admin/member), created_at (TIMESTAMPTZ)

-- tasks
id (UUID), project_id (UUID FK), title (TEXT), description (TEXT), assigned_to (TEXT FK), status (TEXT: todo/in_progress/done), priority (TEXT: low/medium/high), due_date (TIMESTAMPTZ), created_at (TIMESTAMPTZ)

-- comments
id (UUID), task_id (UUID FK), user_id (TEXT), content (TEXT), created_at (TIMESTAMPTZ)
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18+ installed
- **npm** or **yarn**

### 2. Install All Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install individually: `cd backend && npm install`, `cd ../frontend && npm install`)*

### 3. Configure Environment Variables
Ensure `.env` files are created in `backend/` and `frontend/`.

**Backend (`backend/.env`):**
```env
PORT=5050
NODE_ENV=development
CLIENT_URL=http://localhost:5175
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_...
```

**Frontend (`frontend/.env`):**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:5050/api
VITE_SOCKET_URL=http://localhost:5050
```

### 4. Run Development Servers
To run both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5175`
- **Backend API**: `http://localhost:5050`
- **API Health**: `http://localhost:5050/api/health`

---

## 🧪 Running Automated Tests

Run the full integration test suite:
```bash
npm run test
```

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health status | No |
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects` | List projects for current user | Yes |
| `GET` | `/api/projects/:id` | Get project details and members | Yes |
| `PUT` | `/api/projects/:id` | Update project name/description | Yes (Owner/Admin) |
| `DELETE` | `/api/projects/:id` | Delete project | Yes (Owner) |
| `POST` | `/api/projects/:id/members` | Add member by email | Yes (Owner/Admin) |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove member | Yes (Owner/Admin/Self) |
| `POST` | `/api/tasks` | Create a task | Yes (Project Member) |
| `GET` | `/api/tasks/project/:projectId` | List all tasks in a project | Yes (Project Member) |
| `GET` | `/api/tasks/:id` | Get single task details | Yes (Project Member) |
| `PUT` | `/api/tasks/:id` | Update task (status, priority, assignee) | Yes (Project Member) |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes (Project Member) |
| `POST` | `/api/comments` | Add comment to a task | Yes (Project Member) |
| `GET` | `/api/comments/task/:taskId` | List comments for a task | Yes (Project Member) |
| `DELETE` | `/api/comments/:id` | Delete a comment | Yes (Author/Owner) |
| `POST` | `/api/users/sync` | Synchronize Clerk user profile | Yes |
| `GET` | `/api/users/search` | Search registered users by email/name | Yes |

---

## 📄 License
This project was developed for **CodeAlpha Internship Task 3**. MIT License.
