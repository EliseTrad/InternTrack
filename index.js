const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/usersRoute');
const resumesRoute = require('./routes/resumesRoute');
const interviewsRoute = require('./routes/interviewsRoute');
const coverLettersRoute = require('./routes/coverlettersRoute');
const applicationsRoute = require('./routes/applicationsRoute');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoute);
app.use('/api/resumes', resumesRoute);
app.use('/api/interviews', interviewsRoute);``
app.use('/api/covers', coverLettersRoute);
app.use('/api/applications', applicationsRoute);

const PORT = process.env.PORT   
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
});


