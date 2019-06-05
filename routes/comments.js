var express= require("express");
var router = express.Router({mergeParams : true}); //parameter is acceptable
var Comment = require("../models/comment");
var Attraction = require("../models/attraction");
var middleware = require("../middleware");  //default is index.js that is why omitted index.js

//Comment new
router.get("/new",middleware.isLoggedIn, function(req,res){
    Attraction.findById(req.params.id,function(err,attraction){
       if(err){
           console.log(err);
       }else{
          res.render("comments/new", {attraction}); 
       }
    });
   
}); 

//Comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    Attraction.findById(req.params.id,function(err,attraction){
       if(err){
           console.log(err);
           res.redirect("/attractions");
           
       } else{
           
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                    req.flash("error","Something went wrong");
                    console.log(err); 
               } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    attraction.comments.push(comment);
                    attraction.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/attractions/"+attraction._id);
               }
               
           });
           
       }
    });
});

//EDIT route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){ 
    Attraction.findById(req.params.id, function(err,foundattraction){
       if(err || !foundattraction){
           req.flash("error","No attraction found");
           return res.redirect("back");
       }
        Comment.findById(req.params.comment_id, function(err,data){
           if(err || !data){
               req.flash("error","Comment is not found!");
               res.redirect("back");
           } else{
              res.render("comments/edit",{attraction_id :req.params.id , comment:data}) ;  
           }
        });
    });
});

//update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){//findbyid, data that you want to update, logic
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err ){
            res.redirect("back");
        }else{
            req.flash("success","Comment updated");
            res.redirect("/attractions/"+req.params.id); //this id is from app.js :id
        }
    });
});

//destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){ 
      if(err){
          console.log(err);
          res.redirect("back");
      }else{  
          req.flash("success","Comment deleted");
          res.redirect("/attractions/"+req.params.id); 
      } 
  });  
});
 
module.exports = router;