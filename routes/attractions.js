var express= require("express");
var router = express.Router();
var Attraction = require("../models/attraction"); 
var middleware = require("../middleware");  //default is index.js that is why omitted index.js

//when app.js calls attractions.js with url. that is why now used root url instead of "/attractions"
router.get("/",function(req,res){
    
         Attraction.find({},function(err,items){ 
            if(err){
                console.log(err);
            } else{
                res.render("attractions/index",{attractions:items});
            }
         });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name; //title name
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username: req.user.username
    };
    var newattraction ={name : name, image : image, description:desc, author: author, price:price};
    
    Attraction.create(newattraction,function(err, newItem){
       if(err){
        console.log(err); 
       } else{
           
        res.redirect("/attractions"); 
       }
    });
});




router.get("/new",middleware.isLoggedIn,function(req, res){
    res.render("attractions/new");
});


//SHOW - shows more info about one attraction
//it shloud be behind of above link
router.get("/:id",function(req, res){
    Attraction.findById(req.params.id).populate("comments").exec(function(err,item){
       if(err || !item){//if item is null then true
            req.flash('error',"attraction not found!");
            res.redirect('back');
       } else{
            res.render("attractions/show", {attraction:item});
       }
    }); 
});


//EDIT attraction ROUTE
router.get("/:id/edit",middleware.checkAttractionOwnership,function (req,res){ 
        Attraction.findById(req.params.id, function(err,foundattraction){ //already checked in the middleware
                    res.render("attractions/edit",{attraction:foundattraction});  
        });
});

//UPDATE attraction ROUTE

router.put("/:id",middleware.checkAttractionOwnership,function(req,res){
   // find and update the correct attraction 
   Attraction.findByIdAndUpdate(req.params.id,req.body.attraction,function(err, updatedattraction){
      if(err){
          res.redirect("/attractions");
      } else{
            res.redirect("/attractions/"+req.params.id);
      }
   });
    
});


// DESTROY attraction ROUTE
router.delete("/:id",middleware.checkAttractionOwnership,function(req,res, next){
  Attraction.findById(req.params.id, function(err, attraction){ 
      if(err){
          console.log(err);
      }else{
          attraction.remove(); //delete comments by trigger in attraction model
          //req.flash('success','attraction deleted successfully');
          res.redirect("/attractions"); 
      } 
  }); 
});

module.exports = router;