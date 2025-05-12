const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
require('dotenv').config();
const usersRoute = require('./routes/usersRoute');
const resumesRoute = require('./routes/resumesRoute');
const interviewsRoute = require('./routes/interviewsRoute');
const coverLettersRoute = require('./routes/coverlettersRoute');
const applicationsRoute = require('./routes/applicationsRoute');
const pagesRoute = require('./routes/pagesRoute');

app.use(
  session({
    secret: 'yourSecret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// View engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use('/', pagesRoute);
app.use('/users', usersRoute);
app.use('/resumes', resumesRoute);
app.use('/interviews', interviewsRoute);
app.use('/cover-letters', coverLettersRoute);
app.use('/applications', applicationsRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
