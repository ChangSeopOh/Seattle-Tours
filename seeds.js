//========================
 
var Attraction = require("./models/attraction");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cloud's Rest", 
        price: 9.5,
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "5c9f16149ff49e39187fc00a",
            username: "colt"
        }
    },
    {
        name: "Desert Mesa", 
        price: 10.5,
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "5c9f16149ff49e39187fc00a",
            username: "colt"
        }
    },
    {
        name: "Canyon Floor", 
        price: 6.5,
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "5ca0199c6b3a190ebce6ec59",
            username: "potato"
        }
    }
]
 
function seedDB(){
   //Remove all attractions
   Attraction.deleteMany({}, function(err){
        if (err){
            console.log(err);
        }
        console.log("removed attractions!");
        Comment.deleteMany({}, function(err) {
            if (err){
                console.log(err);
            }
            console.log("removed comments!");
            //add a few attractions
            data.forEach(function(seed){
                Attraction.create(seed, function(err, attraction){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a attraction");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author:{
                                    id : "5c9f16149ff49e39187fc00a",
                                    username: "colt"
                                }
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    attraction.comments.push(comment);
                                    attraction.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        })
    }); 
    //add a few comments
}
 
module.exports = seedDB;