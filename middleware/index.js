// all the middleare goes here
var middlewareObj = {};
var Attraction = require("../models/attraction"); 
var Comment = require("../models/comment"); 

middlewareObj.checkAttractionOwnership = function(req,res,next){
        
    if(req.isAuthenticated()){ 
        Attraction.findById(req.params.id, function(err,attraction){
            if(err || !attraction){  //if data is null then bottom> !null -> true // !!null -> false // null -> null
                req.flash("error","Attraction not found");
                res.redirect("back");
            }else{
                //you can't use eqaul sign you have to use equals method because of different type
                if(attraction.author.id.equals(req.user._id)){
                    next();
                }else{ 
                    req.flash("error","You don't have permisstion to do that");
                    res.redirect("back");
                }
            }
        }); 
    }else{ 
        req.flash("error","You need to be logeed in to do that");
        res.redirect("back");
        
    } 
};



middlewareObj.checkCommentOwnership = function(req,res,next){
        if(req.isAuthenticated()){ 
        Comment.findById(req.params.comment_id, function(err,comment){
            if(err || !comment){ //!comment !null -> true
                req.flash("error","Comment not found");
                res.redirect("back");
            }else{
                //you can't use === you have to use equals method because of different type
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{ 
                    req.flash("error","You don't have permisstion to do that");
                    res.redirect("back");
                }
            }
        }); 
    }else{
        req.flash("error","You need to be logeed in to do that");
        res.redirect("back");
        
    } 
};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logeed in to do that");
    res.redirect("/login");
};



module.exports = middlewareObj;




