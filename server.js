const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
dotenv.config({path:'./config/config.env'})

//connect to database
connectDB();


const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());
app.set('view engine', 'ejs');
require('./config/passport');
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(session({ secret: process.env.JWT_SECRET, resave: true, saveUninitialized: true  }));
app.use(passport.initialize());
app.use(passport.session());

const menu = require('./routes/menu');
const auth = require('./routes/auth');
const index = require('./routes/index');
const table = require('./routes/table');

app.use('/', index);
app.use('/api/v1/menu', menu);
app.use('/api/v1/auth', auth);
app.use('/api/v1/table', table);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in mode '+ process.env.NODE_ENV +' on port ' + PORT));

//Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
})