# Intertracker

**Intertracker** is a simple and efficient platform designed to help students and young professionals manage their internship applications effectively.

It provides tools for:
- Application tracking
- Status updates
- Reminders
- Progress monitoring

Intertracker helps users stay organized and never miss an opportunity during their internship search.

---

## 🔑 Key Features

- Application Tracking  
- Deadline Reminders  
- Resume & Cover Letter Management  
- Interview Scheduler  
- Progress Dashboard  
- Smart Filters  
- Notes & Follow-Up Reminders  
- Data Export (Excel)  
- Privacy and Security  
- Collaboration with mentors/counselors  

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
   cd intertracker

2. **Install dependencies**
   ```bash
   npm install   

3. **Configure environment variables: Create a .env file with the following**
   ```bash
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_PORT=3306
   DB_NAME=intertracker
   PORT=3001  

4. **Create the database: Make sure MySQL is running, then create the database**
   ```bash
   mysql -u your_database_user -p -e "CREATE DATABASE intertracker;"

5. **Start the server**
   ```bash
   npm start
The app will be running at: http://localhost:3001

## API Routes

### Users
- `POST /register`           - Register a new user
- `POST /authenticate`       - Authenticate a user
- `PUT /update/:id`          - Update user details
- `GET /`                    - Get all users
- `GET /:id`                 - Get a user by ID
- `GET /name/:name`          - Get a user by name
- `GET /email/:email`        - Get a user by email
- `DELETE /delete/:id`       - Delete a user by ID

### Resumes
- `POST /create`             - Create a new resume
- `PUT /update/:id`          - Update a resume by ID
- `GET /`                    - Get all resumes
- `GET /user/:userId`        - Get resumes by user ID
- `GET /:id`                 - Get a resume by ID
- `DELETE /delete/:id`       - Delete a resume by ID

### Cover Letters
- `POST /create`             - Create a new cover letter
- `PUT /update/:id`          - Update a cover letter by ID
- `GET /`                    - Get all cover letters
- `GET /user/:userId`        - Get cover letters by user ID
- `GET /:id`                 - Get a cover letter by ID
- `DELETE /delete/:id`       - Delete a cover letter by ID

### Applications
- `POST /create`             - Create a new application
- `PUT /update/:id`          - Update an application by ID
- `GET /`                    - Get all applications
- `GET /:id`                 - Get an application by ID
- `GET /user/:id`            - Get applications by user ID
- `GET /company/:name`       - Get by company name
- `GET /position/:title`     - Get by position title
- `GET /status/:status`      - Get by status
- `GET /deadline/:deadline`  - Get by deadline
- `GET /date/:date`          - Get by date
- `GET /source/:source`      - Get by source
- `GET /resume/:resumeId`    - Get by resume ID
- `GET /cover/:coverId`      - Get by cover letter ID
- `GET /count/:userId`       - Get count for a user
- `GET /export/excel/:userId` - Export to Excel
- `DELETE /delete/:id`       - Delete an application

### Interviews
- `POST /create`             - Create a new interview
- `PUT /update/:id`          - Update an interview
- `GET /`                    - Get all interviews
- `GET /:id`                 - Get an interview by ID
- `GET /date/:date`          - Get by date
- `GET /location/:loc`       - Get by location
- `GET /reminder/:reminder`  - Get by reminder status
- `GET /status/:status`      - Get by status
- `GET /application/:id`     - Get by application ID
- `GET /count/status/:status` - Count by status
- `DELETE /delete/:id`       - Delete an interview



