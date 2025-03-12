const express = require('express');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/usersRoute');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoute);

const PORT = process.env.PORT   
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
});