<p align="center">
  <img src="FrontEnd/src/assets/logos/logo-full.png" alt="Enjaz Logo" width="400" />
</p>

# Enjaz Task Manager (MERN-Stack)

<p align="center">
  <a href="https://github.com/ShawkyMohamed2004/enjaz-task-manager">
    <img src="https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=600&size=24&duration=4000&pause=1000&color=10B981&center=true&vCenter=true&width=500&lines=A+powerful+MERN-stack+task+manager.;Tasks%2C+todos%2C+notes%2C+and+more.;Organize+your+life+efficiently." alt="Typing SVG" />
  </a>
</p>

---

## Badges

![Node.js](https://img.shields.io/badge/Node.js-24.x-green) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-8.0.0-green) ![Express](https://img.shields.io/badge/Express-4.18.2-grey) ![Passport.js](https://img.shields.io/badge/Passport.js-0.6.0-red) ![License](https://img.shields.io/badge/License-MIT-yellow) ![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [API Overview (Full Reference)](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

### What is Enjaz?
Enjaz is a comprehensive task management application built on the MERN (MongoDB, Express, React, Node.js) stack. It provides a unified platform for managing your daily activities, from creating tasks with priorities and deadlines to organizing quick notes and todo lists.

### What Problem Does It Solve?

In today's fast-paced world, staying organized is more challenging than ever. Enjaz addresses this by:

- **Centralizing Productivity** — All your tasks, todos, and notes in one place
- **Priority Management** — Focus on what matters most with task prioritization
- **Deadline Tracking** — Never miss a deadline with calendar integration
- **Quick Notes** — Capture ideas instantly without switching apps
- **Cross-Device Sync** — Access your data from anywhere

### Who Is It For?

- **Professionals** managing multiple projects and deadlines
- **Students** organizing assignments and study schedules
- **Freelancers** tracking client work and deliverables
- **Anyone** looking to boost personal productivity

---

## Screenshots

### Authentication

| Page | Light Mode | Dark Mode |
|------|------------|-----------|
| **Login** | ![Login Light](screenshots/login-light.png) | ![Login Dark](screenshots/login-dark.png) |
| **Sign Up** | ![Sign Up Light](screenshots/signup-light.png) | ![Sign Up Dark](screenshots/signup-dark.png) |
| **Forgot Password** | ![Forgot Light](screenshots/forgot-light.png) | ![Forgot Dark](screenshots/forgot-dark.png) |

### Main Pages

| Page | Light Mode | Dark Mode |
|------|------------|-----------|
| **Dashboard** | ![Dashboard Light](screenshots/dashboard-light.png) | ![Dashboard Dark](screenshots/dashboard-dark.png) |
| **Tasks** | ![Tasks Light](screenshots/tasks-light.png) | ![Tasks Dark](screenshots/tasks-dark.png) |
| **Todos** | ![Todos Light](screenshots/todos-light.png) | ![Todos Dark](screenshots/todos-dark.png) |
| **Notes** | ![Notes Light](screenshots/notes-light.png) | ![Notes Dark](screenshots/notes-dark.png) |

### Settings (Tabbed Layout)

| Tab | Light Mode | Dark Mode |
|-----|------------|-----------|
| **Profile** | ![Profile Light](screenshots/profile-light.png) | ![Profile Dark](screenshots/profile-dark.png) |
| **Security** | ![Security Light](screenshots/security-light.png) | ![Security Dark](screenshots/security-dark.png) |
| **Notifications** | ![Notifications Light](screenshots/notifications-light.png) | ![Notifications Dark](screenshots/notifications-dark.png) |
| **Account Actions** | ![Account Actions Light](screenshots/account-actions-light.png) | ![Account Actions Dark](screenshots/account-actions-dark.png) |

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Task Management** | Create, edit, delete tasks with priorities (High/Medium/Low) and deadlines |
| **To-Do Lists** | Quick reminder lists with categories and status tracking |
| **Notes Management** | Rich notes with auto-save, **Chronological Pinning (LIFO)**, and pinned-to-top functionality |
| **Dashboard** | Overview of all your items with quick actions |

### Authentication & Security

| Feature | Description |
|---------|-------------|
| **Email/Password** | Traditional registration and login with email domain validation and password hashing |
| **Firebase Sync** | Dedicated Firebase integration to sync profile data seamlessly across platforms |
| **Google OAuth** | One-click secure sign-in via Passport.js & Google Strategy |
| **Password Recovery** | Robust JWT and Email-based password reset workflow |
| **Route Protection** | `ProtectedRoute` component prevents unauthorized access to all `/Home` routes |
| **Future Expansion** | Built-in placeholders ready for Apple and Microsoft integrations |

### Email Notification System

| Feature | Description |
|---------|-------------|
| **Welcome Email** | Branded onboarding email sent to new users upon registration |
| **Login Alert** | Security notification with device/browser info on every login |
| **Password Reset** | Secure reset link via email with 10-minute JWT expiry |
| **Password Changed** | Confirmation email after successful password update |
| **Daily Reminders** | Automated daily email for tasks and todos due today via `node-cron` |

### Settings (Sidebar Tabbed Layout)

| Tab | Description |
|-----|-------------|
| **Profile** | Avatar with crop tool, name editing, email display |
| **Security** | Password change with current/new/confirm fields |
| **Notifications** | Toggle email preferences (Login Alerts, Daily Reminders with custom time picker, Password Changes) |
| **Account Actions** | Delete account (with password confirmation) and Log Out |

### UI/UX Features

| Feature | Description |
|---------|-------------|
| **Dark Mode** | Full dark theme support with easy toggle |
| **Glassmorphism Auth** | Frosted-glass login/signup UI with background blur |
| **Notifications** | Real-time bell notifications for due tasks (auto-refreshes at midnight) |
| **Calendar View** | Monthly calendar showing task deadlines with today highlighted in green |
| **Animations** | Smooth AOS animations for enhanced UX |
| **Image Cropping** | Built-in crop tool for profile photo uploads |

---

## Tech Stack

### Frontend Dependencies

| Technology | Version | Used For |
|-----------|---------|----------|
| React | 18.2.0 | UI framework |
| React Router DOM | 6.18.0 | Client-side routing |
| Axios | 1.6.0 | HTTP client |
| MUI Material | 5.14.20 | UI component library (DatePicker, Calendar) |
| Firebase | 12.12.0 | Google Auth sync & services |
| React Toastify | 9.1.3 | Toast notifications |
| React Easy Crop | — | Profile photo cropping |
| React Icons | — | Icon library (Fa, Io, Md, Bi) |
| React Spinners | — | Loading spinners |
| AOS | — | Scroll-based animations |
| Typewriter Effect | — | Quote typing animation |

### Backend Dependencies

| Technology | Version | Used For |
|-----------|---------|----------|
| Node.js | 24.x | Execution Environment |
| Express | 4.18.2 | Web framework |
| Mongoose | 8.0.0 | MongoDB ODM |
| Passport.js | 0.6.0 | Authentication & OAuth |
| JSON Web Token | 9.0.2 | Token generation (Password Reset) |
| BCrypt | 5.1.1 | Password hashing |
| Nodemailer | 6.9.7 | Branded HTML email service |
| Node-Cron | 4.2.1 | Scheduled daily task reminders |
| Connect-Mongo | 5.1.0 | MongoDB session store |
| Dotenv | 16.3.1 | Environment variable management |

### Database Configuration
The project is fully compatible with **both** Local MongoDB and MongoDB Atlas (Cloud). 

## Architectural Decisions

### Client-Side Timestamps (vs UTC)
In Enjaz, timestamps for Notes and Tasks (creation time/date) are generated by the React Frontend (`new Date()`) and passed to the Express Backend, rather than having the Backend generate them using UTC. 
- **Why?** Since Enjaz is a *Personal Task Manager* with no collaborative multi-user workflows, the user's local device time is the most relevant Single Source of Truth for their schedule.
- **Benefit:** This eliminates the need for complex timezone conversions (e.g., UTC to Local) on the frontend, resulting in a significantly lighter backend storage pattern and a faster UI rendering cycle.

---

## Project Structure (MVC)

```text
enjaz-task-manager/
│
├── BackEnd/                              # Node.js & Express MVC Backend
│   ├── index.js                          # Main entry point & server config
│   ├── passport.js                       # Passport.js strategies (Google, Local)
│   ├── cronService.js                    # Scheduled jobs (daily email reminders)
│   ├── .env                              # Environment variables (SECURED)
│   │
│   ├── Controllers/                      # BUSINESS LOGIC LAYER
│   │   ├── authController.js             # Auth: signup, login, logout, OAuth, password reset, delete account
│   │   ├── taskController.js             # Tasks: CRUD operations
│   │   ├── todoController.js             # Todos: CRUD operations
│   │   └── noteController.js             # Notes: CRUD operations
│   │
│   ├── Models/                           # DATA LAYER (Mongoose Schemas)
│   │   ├── Model.js                      # User authentication schema
│   │   └── DataModel.js                  # User data schema (tasks, todos, notes)
│   │
│   ├── Routes/                           # ROUTING LAYER (API Endpoints)
│   │   ├── AuthRoutes.js                 # Auth, profile, social & password routes
│   │   ├── TaskRoutes.js                 # /task/* endpoints
│   │   ├── TodoRoutes.js                 # /todo/* endpoints
│   │   └── NoteRoutes.js                 # /note/* endpoints
│   │
│   ├── Middlewares/                       # MIDDLEWARE LAYER
│   │   └── authMiddleware.js             # Session-based authentication guard
│   │
│   └── Utils/                            # UTILITY LAYER
│       └── emailService.js               # Nodemailer: branded HTML email templates
│
├── FrontEnd/                             # React.js Frontend
│   ├── public/                           # Static assets
│   │   ├── index.html                    # HTML template
│   │   ├── logo-icon.png                 # App icon
│   │   ├── manifest.json                 # PWA manifest
│   │   └── robots.txt                    # SEO robots config
│   │
│   └── src/
│       ├── App.js                        # Root component & routing (with ProtectedRoute)
│       ├── App.css                       # Global styles & auth page design
│       ├── index.js                      # React entry point
│       ├── index.css                     # Root CSS variables & theme
│       ├── firebase.js                   # Firebase client configuration
│       │
│       ├── api/                          # API SERVICE LAYER
│       │   ├── apiConfig.js              # Axios base configuration
│       │   ├── authApi.js                # Auth API calls
│       │   ├── taskApi.js                # Task API calls
│       │   ├── todoApi.js                # Todo API calls
│       │   └── noteApi.js                # Note API calls
│       │
│       ├── pages/                        # VIEW LAYER (Page Components)
│       │   ├── Auth/                     # Authentication pages
│       │   │   ├── Mainpage.js           # Login & Register forms
│       │   │   ├── Toggler.js            # Auth page wrapper
│       │   │   ├── ForgotPass.js         # Forgot password page
│       │   │   ├── ResetPass.js          # Reset password page
│       │   │   └── forgotpass.css        # Forgot/Reset styles
│       │   │
│       │   ├── Home/                     # Main layout
│       │   │   ├── Home.js               # Layout wrapper with sidebar
│       │   │   └── Home.css              # Layout & page styles
│       │   │
│       │   ├── Dashboard/                # Dashboard page
│       │   │   ├── Dashboard.js          # Dashboard overview
│       │   │   └── DashBoardCom/         # Dashboard widgets
│       │   │       ├── MainTask.js       # Tasks summary widget
│       │   │       ├── MainTodo.js       # Todos summary widget
│       │   │       └── MainNote.js       # Notes summary widget
│       │   │
│       │   ├── Tasks/                    # Tasks page
│       │   │   ├── Task.js               # Task management UI
│       │   │   └── task.css              # Task styles
│       │   │
│       │   ├── Todos/                    # Todos page
│       │   │   ├── Todo.js               # Todo list UI
│       │   │   └── todo.css              # Todo styles
│       │   │
│       │   ├── Notes/                    # Notes page
│       │   │   └── Notes.js              # Notes list UI
│       │   │
│       │   └── Settings/                 # Settings page (Sidebar Tabbed Layout)
│       │       ├── Settings.js           # Profile, Security, Notifications, Account Actions
│       │       └── settings.css          # Settings styles
│       │
│       ├── components/                   # SHARED COMPONENTS
│       │   ├── Navbar.js                 # Sidebar navigation
│       │   ├── TopHeader.js              # Top bar with search & notifications
│       │   ├── ProtectedRoute.js         # Auth guard (redirects unauthenticated users)
│       │   ├── Calendar/                 # Mini calendar widget
│       │   │   ├── Calendar.js
│       │   │   └── calendar.css
│       │   ├── DarkMode/                 # Theme toggle
│       │   │   ├── Darkmode.js
│       │   │   └── darkmode.css
│       │   ├── Notification/             # Bell notification dropdown
│       │   │   ├── Notification.js
│       │   │   └── notification.css
│       │   ├── Notes/                    # Individual note card
│       │   │   ├── Note.js
│       │   │   └── notes.css
│       │   └── SrNoDialog/              # Delete confirmation dialog
│       │       ├── Dialog.js
│       │       └── dialog.css
│       │
│       └── assets/                       # STATIC ASSETS
│           ├── images/                   # Background images
│           └── logos/                    # App logos & branding
│
├── screenshots/                          # UI Screenshots for documentation
├── Project_Guide/                        # Detailed Project Book & Scripts
│   ├── PROJECT_BOOK.md                   # Full MVC Architecture & Flow explanation
│
├── Enjaz_Postman_Collection.json         # Postman API testing collection (30 active endpoints)
├── README.md                             # This file
└── .gitignore                            # Git ignore rules
```

---

## Getting Started

### Prerequisites
| Requirement | Version |
|------------|---------|
| Node.js | 24.x or higher |
| MongoDB | 4.0 or higher |
| Git | Any recent version |

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/ShawkyMohamed2004/enjaz-task-manager.git
cd enjaz-task-manager
```

2. **Install Dependencies**
```bash
# In BackEnd
npm install
# In FrontEnd
npm install
```

3. **Configure Environment Variables**

Create `BackEnd/.env`:
```env
MONGO_URL=mongodb://localhost:27017/enjaz
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_DOMAIN=http://localhost:3000
SESSION_SECRET=your_session_secret
JWT_SECRET_KEY=your_jwt_secret
PORT=8080
GOOGLE_CALLBACK_URL=http://localhost:8080/google/callback
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Start the Servers**
```bash
npm start # Command used in both FrontEnd and BackEnd spaces.
```

---

## API Overview

*Enjaz offers **29** endpoints (**25 Active** + **4** structured placeholders).*

### 1- Core CRUD Endpoints (12)
| Method | Endpoint | Category | Description |
|:-- |:-- |:-- |:--- |
| **GET** | `/task/getTask` | Tasks | Get all tasks |
| **POST** | `/task/postTask` | Tasks | Create new task |
| **PATCH** | `/task/updateTask/:id` | Tasks | Update task |
| **DELETE** | `/task/deleteTask/:id` | Tasks | Delete task |
| **GET** | `/todo/getTodo` | To-Dos | Get all todos |
| **POST** | `/todo/postTodo` | To-Dos | Create new todo |
| **PATCH** | `/todo/updateTodo/:todoId` | To-Dos | Update todo |
| **DELETE** | `/todo/deleteTodo/:todoId` | To-Dos | Delete todo |
| **GET** | `/note/getNote` | Notes | Get all notes |
| **POST** | `/note/postNote` | Notes | Create new note |
| **PATCH** | `/note/updateNote/:id` | Notes | Update/Pin note |
| **DELETE** | `/note/deleteNote/:id` | Notes | Delete note |

### 2- Authentication & Account Endpoints (13)
| Method | Endpoint | Category | Description |
|:-- |:-- |:-- |:--- |
| **GET** | `/` | System | Health check & Version status |
| **POST** | `/signup` | Auth | Create a new user account |
| **POST** | `/login` | Auth | User local authentication |
| **GET** | `/logout` | Auth | Kill Session securely |
| **GET** | `/getUser` | Account | Get current authenticated user |
| **POST** | `/forgotpass` | Account | Send reset via Email |
| **POST** | `/resetPassword/:id/:token`| Account | Validate Token & Reset |
| **POST** | `/editProfile` | Profile | Basic name update |
| **POST** | `/updateFullProfile` | Profile | Complete sync update |
| **POST** | `/deleteAccount` | Profile | Permanently delete account & data |
| **POST** | `/firebase-auth` | Social | Sync logic with Firebase |
| **GET** | `/google` | Social | Init OAuth2.0 Flow |
| **GET** | `/google/callback` | Social | OAuth2.0 Callback |

### 3- Social Placeholders (4)
| Method | Endpoint | Category | Description |
|:-- |:-- |:-- |:--- |
| **GET** | `/microsoft` | Social | Future placeholder |
| **GET** | `/microsoft/callback` | Social | Future placeholder |
| **GET** | `/apple` | Social | Future placeholder |
| **GET** | `/apple/callback` | Social | Future placeholder |

> 📬 For Postman testing, import [Enjaz_Postman_Collection.json](Enjaz_Postman_Collection.json)  
> 📘 For full project documentation, see [PROJECT_BOOK.md](Project_Guide/PROJECT_BOOK.md)

---

## Contributing
Contributions are massively welcome! Follow these steps:
1. Fork the repo and create your branch: `git checkout -b feature/idea`
2. Commit your changes: `git commit -m 'Add specific feature'`
3. Push to the branch: `git push origin feature/idea`
4. Open a pull request.

---

<!-- Animated SVG Footer representation of waves -->
<p align="center">
  <a href="#">
    <img src="https://capsule-render.vercel.app/api?type=waving&color=10B981&height=150&section=footer&text=Enjaz%20-%20Empowering%20Productivity&fontSize=25&fontColor=ffffff&animation=waving" width="100%">
  </a>
</p>
