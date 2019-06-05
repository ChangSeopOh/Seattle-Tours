var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/",function(req,res){
    res.render("landing");
});
 
 
//=======================
// AUTH ROUTES
//=======================

// show register form
router.get("/register",function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username : req.body.username});
   
   User.register(newUser,req.body.password,function(err, user){
       if(err){
           req.flash("error",err.message);
           return res.redirect("register");
       }
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome to SeattleTours "+user.username);
           res.redirect("/attractions");
       });
   });
});

// show login form
router.get("/login", function(req,res){
    res.render("login");
});

//handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/attractions",
        failureRedirect:"/login",
        failureFlash : "Invalid username or password"
    }),function(req,res){
});

//logic route
router.get("/logout",function(req,res){
   req.logout();
   req.flash("success","Logged you out!"); // before redirect
    res.redirect("/attractions");
});


router.get("/*",function(req,res){
    req.flash("error","Page not Found"); // before redirect
    res.redirect("/"); 
});


module.exports = router;