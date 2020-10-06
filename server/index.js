require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./authcontroller');
const treasureCtrl = require('./treasureController');
const auth = require('./middleware/authMiddleware');


const {SESSION_SECRET, SERVER_PORT, CONNECTION_STRING} = process.env;

const app = express(); //Declare express variable
app.use(express.json()); //JSON parser

app.use( //Declare session values
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
    })
)

//Endpoints -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//auth
app.post('/auth/register', authCtrl.register);
app.post('/auth/login',authCtrl.login);
app.get('/auth/logout',authCtrl.logout);

//treasure
app.get('/api/treasure/dragon',treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.adminsOnly, auth.usersOnly, treasureCtrl.getAllTreasure);




//Server init -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  }).then(db => {
    app.set('db', db);
    console.log('db connected');

    app.listen(SERVER_PORT,()=>console.log(`Server running on port ${SERVER_PORT}`));
  });

