# Interntracker

**Interntracker** is a simple and efficient platform designed to help students and young professionals manage their internship applications effectively.

It provides tools for:
- **Application tracking**
- **Status updates**
- **Reminders**
- **Progress monitoring**

Interntracker helps users stay organized and never miss an opportunity during their internship search.

---

## 🔑 Key Features

- **Application Tracking**  
- **Deadline Reminders**  
- **Resume & Cover Letter Management**  
- **Interview Scheduler**  
- **Progress Dashboard**  
- **Smart Filters**  
- **Notes & Follow-Up Reminders**  
- **Data Export (Excel)**  
- **Privacy and Security**  
- **Collaboration with mentors/counselors**  

---

## 🛠 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MySQL
- Sequelize CLI

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/EliseTrad/Intertracker.git
   cd Intertracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in the root directory with the following content:
   ```bash
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_PORT=3306
   DB_NAME=intertracker
   PORT=3001
   ADMIN_NAME=your_admin_name
   ADMIN_PASSWORD=your_admin_password

   ```

4. **Create the database**  
   Make sure MySQL is running, then create the database:
   ```bash
   mysql -u your_database_user -p -e "CREATE DATABASE intertracker;"
   ```

5. **Run migrations and (optionally) seed data**
   ```bash
   npx sequelize-cli db:migrate
   # npx sequelize-cli db:seed:all
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   The app will be running at: [http://localhost:3001](http://localhost:3001)

---

## 🌐 Main Screens & UX

- **Landing Page:** Login and Registration with validation and error feedback. Admins can log in using credentials stored in the .env file. If an admin logs in, they are redirected to                       the admin dashboard. Normal users are redirected to the user dashboard.
- **Admin Dashboard:** Displays a list of all users. Admin can delete any user or log in as the selected user (impersonation feature).
- **User Dashboard:** Provides buttons to navigate between edit-profile, applications, resumes, cover-letters, and interviews pages.
- **Application List:** Table of all applications with smart filters, search, and export option.
- **Edit Profile:** Allows users to update their name, email, password, and profile picture, or log out.
- **Resume & Cover Letter Pages:** Upload, rename, delete, and search your documents.
- **Application Page:** View all applications with total count, smart filters, and search. Add or update applications using an inline form on the same page. Delete any application.
- **Interview Scheduler:** View all interviews with related application name and position title. Full CRUD operations available. Search and filter by status, date, location...
- **Responsive EJS Views:** All pages are rendered using EJS templates. The interface is responsive and provides clear feedback on all actions (success, error, and validation messages).

---

## 📚 API Routes

### Users
- `POST /register`             — Register a new user
- `POST /authenticate`         — Authenticate a user
- `PUT /update/:id`            — Update user details
- `GET /`                      — Get all users
- `GET /:id`                   — Get a user by ID
- `GET /name/:name`            — Get a user by name
- `GET /email/:email`          — Get a user by email
- `DELETE /delete/:id`         — Delete a user by ID

### Resumes
- `POST /create`               — Create a new resume
- `PUT /update/:id`            — Update a resume by ID
- `GET /`                      — Get all resumes
- `GET /user/:userId`          — Get resumes by user ID
- `GET /:id`                   — Get a resume by ID
- `DELETE /delete/:id`         — Delete a resume by ID

### Cover Letters
- `POST /create`               — Create a new cover letter
- `PUT /update/:id`            — Update a cover letter by ID
- `GET /`                      — Get all cover letters
- `GET /user/:userId`          — Get cover letters by user ID
- `GET /:id`                   — Get a cover letter by ID
- `DELETE /delete/:id`         — Delete a cover letter by ID

### Applications
- `POST /create`                           — Create a new application
- `PUT /update/:id`                        — Update an application by ID
- `GET /`                                  — Get all applications
- `GET /:id`                               — Get an application by ID
- `GET /user/:id`                          — Get applications by user ID
- `GET /company/:name`                     — Get applications by company name
- `GET /company/:name/user/:userId`        — Get applications by company name for a specific user
- `GET /position/:title`                   — Get applications by position title
- `GET /position/:title/user/:userId`      — Get applications by position title for a specific user
- `GET /status/:status`                    — Get applications by status
- `GET /status/:status/user/:userId`       — Get applications by status for a specific user
- `GET /deadline/:deadline`                — Get applications by deadline
- `GET /deadline/:deadline/user/:userId`   — Get applications by deadline for a specific user
- `GET /date/:date`                        — Get applications by date
- `GET /date/:date/user/:userId`           — Get applications by date for a specific user
- `GET /source/:source`                    — Get applications by source
- `GET /source/:source/user/:userId`       — Get applications by source for a specific user
- `GET /resume/:resumeId`                  — Get applications by resume ID
- `GET /cover/:coverId`                    — Get applications by cover letter ID
- `GET /count/:userId`                     — Get application count for a user
- `GET /export/excel/:userId`              — Export applications for a user to Excel
- `DELETE /delete/:id`                     — Delete an application

#### 🔍 **Smart Filtering and User-specific Queries**
The backend supports advanced filtering for applications by company, position, status, deadline, date, and source for each user.  
Examples:  
- `GET /applications?status=waitlist&company=Acme`  
- `GET /applications?source=LinkedIn&date=2025-05-15`  
- `GET /applications?user=3&status=accepted`  
- `GET /applications/company/Acme/user/3` (company name + user)

### Interviews
- `POST /create`                           — Create a new interview
- `PUT /update/:id`                        — Update an interview
- `GET /`                                  — Get all interviews
- `GET /:id`                               — Get an interview by ID
- `GET /date/:date`                        — Get interviews by date
- `GET /location/:loc`                     — Get interviews by location
- `GET /reminder/:reminder`                — Get interviews by reminder status
- `GET /status/:status`                    — Get interviews by status
- `GET /application/:id`                   — Get interviews by application ID
- `GET /count/status/:status`              — Count interviews by status
- `DELETE /delete/:id`                     — Delete an interview

---

## 🗂 Architecture

- **Express.js** backend — RESTful API and EJS views
- **Sequelize ORM** — Models, migrations, and database access
- **MySQL** — Data storage
- **EJS** — Server-side rendering of user-facing pages; all feedback and lists are visually clear
- **Service Layer** — All business logic is in `services/`, with each service well-documented
- **Repository Layer** — All direct DB access in `repositories/`
- **Middleware** — Handles authentication, uploads, validation, and sanitization
- **Comprehensive JSDoc** — All helpers, services, and utilities are documented

---

## ✅ Contributing

1. Fork this repo and create a new branch for your feature or bugfix.
2. Use clear commit messages and document your code (JSDoc preferred).
3. Open a pull request and describe your changes.

---

## 📄 License

MIT

---
