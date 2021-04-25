require('dotenv').config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose= require('mongoose');
const PORT = process.env.PORT || 3100;
const session= require('express-session');
const MongoDbStore= require('connect-mongo')(session)
const flash= require('express-flash');
app.use(flash());


//DB COnnection
const url= 'mongodb://localhost/cloudKitchen';
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true});
const conn= mongoose.connection;
conn.once('open', () =>{
  console.log('Database Connected...');
}).catch((err) =>{
  console.log('Database Connection Failed...');
});

//session Store
let mongoStore = new MongoDbStore({
    mongooseConnection:conn,
    collection:'sessions'
  })
  
  //session config
  app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:true,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge: 1000*60*60*24}
  }));
  
  //Assets 
  app.use(express.static('public'));
  app.use(express.json());

//Global Middleware
app.use((req,res,next) =>{
    res.locals.session= req.session;
    next();
})

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


require('./routes/web')(app);
