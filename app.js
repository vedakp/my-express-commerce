const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');


//Connecting to mongodb
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("We're connected to Mongodb!");
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//set routes
//Routes
const pages = require('./routes/v1/pages')
const admin = require('./routes/v1/admin')
const users = require('./routes/v1/users')

// app.use('/',pages);
app.use('/admin',admin);
app.use('/users',users);


//Expres Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//View Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req, res){
    res.render('_layouts/userpages/index',{
        title:'Home'
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
