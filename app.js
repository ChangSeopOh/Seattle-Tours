require('dotenv').config();

    //nvm(node version manager) at least 8 to use hook up method.
    //nodemon to use auto start function.

var express = require("express"),
        app = express(),
      flash = require("connect-flash"),
 bodyParser = require("body-parser"),
   mongoose = require("mongoose"), 
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
   User = require("./models/user"),
   methodOverride = require("method-override"); 
const port = process.env.PORT || 3000;

//requring routes!!
var commentRoutes = require("./routes/comments");
var attractionRoutes = require("./routes/attractions");
var indexRoutes = require("./routes/index");
   
    
//   Comment  = require("./models/comment"),
//   User     = require("./models/user")


app.set("view engine","ejs");
app.use(flash()); //need to put before passport configuration
app.use(require("express-session")({
        secret: "This is Screte Set up!",
        resave : false,
        saveUninitialized : false
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(function(req,res,next){ //current user -> you can use for authorization like show.ejs 
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
}); //this is middle ware send currentUser parameter
//__dirname is directory name(path)
app.use(methodOverride("_method")); //it should be in front of  app.use(route) to use method override function.


app.use("/attractions",attractionRoutes);
app.use("/attractions/:id/comments",commentRoutes);
app.use("/",indexRoutes);
//local
//mongoose.connect("mongodb://localhost:27017/seattle_tours", {useNewUrlParser:true, useFindAndModify: false });

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser:true, 
  useFindAndModify: false 
}).then(()=>{
  console.log('Conntected to DB!');
}).catch(err =>{
  console.log('DB Error : ', err.message);
});

  

//seedDB();  //seed the database

// app.listen(process.env.PORT, process.env.IP, function(){
//       console.log(`Server is running`);
// });
 app.listen(port,"0.0.0.0",function(){
    console.log("Server has started ....");
});


