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
// const passport= require('passport');
const flash= require('express-flash');
const passport = require('passport'); 
const Emitter= require('events');
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
  

  //Emiiter 
  const eventEmitter= new Emitter();
  app.set('eventEmitter', eventEmitter);
  //session config
  app.use(session({
    secret:"thisismysecret",
    resave:true,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge: 1000*60*60*24}
  }));
  
  //passport config
const passportInit= require('./app/config/passport');
const { Console } = require('console');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

  //Assets 
  app.use(express.static('public'));
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());

//Global Middleware
app.use((req,res,next) =>{
    res.locals.session= req.session;
    res.locals.user= req.user // for login users
    next();
})

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
const server=app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

//Socket Connection
const io= require("socket.io")(server);
io.on('connection', (socket)=>{
    //Join
    console.log(socket.id);
    socket.on('join', (orderId)=>{
      console.log(orderId);
       socket.join(orderId);
    })
})


eventEmitter.on('orderUpdated', (data)=>{
  io.to(`Order_${data.id}`).emit('orderUpdated', data);
}) 

eventEmitter.on('orderPlaced', (data) =>{
  io.to('updateAdmin').emit('updateAdminPage', data);
})
require('./routes/web')(app);
app.use((req,res) =>{
  res.status(404).render('error/404');
})
