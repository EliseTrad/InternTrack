// Main server file for my Interntracker project

// Import required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
require('dotenv').config();

// Import all my route files
const usersRoute = require('./routes/usersRoute');
const resumesRoute = require('./routes/resumesRoute');
const interviewsRoute = require('./routes/interviewsRoute');
const coverLettersRoute = require('./routes/coverlettersRoute');
const applicationsRoute = require('./routes/applicationsRoute');
const pagesRoute = require('./routes/pagesRoute');
const userPagesRoute = require('./routes/userPagesRoute');
const resumePagesRoute = require('./routes/resumePagesRoute');
const coverLetterPagesRoute = require('./routes/coverLetterPagesRoute');

// Set up session middleware
app.use(
  session({
    secret: 'yourSecret', // In production, I should move this to .env
    resave: false,
    saveUninitialized: false,
  })
);

// Set up body parsers for incoming JSON and form data
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Set up flash messaging and make it available to views
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Set up EJS as my view engine and serve static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Route handling (I grouped APIs and pages logically)
app.use('/', pagesRoute);
app.use('/resumePage', resumePagesRoute);
app.use('/coverLetterPage', coverLetterPagesRoute);
app.use('/userPage', userPagesRoute);
app.use('/users', usersRoute);
app.use('/resumes', resumesRoute);
app.use('/interviews', interviewsRoute);
app.use('/cover-letters', coverLettersRoute);
app.use('/applications', applicationsRoute);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
