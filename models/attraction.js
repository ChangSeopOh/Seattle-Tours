
var mongoose = require("mongoose");
const Comment = require('./comment');

var attractionSchema = new mongoose.Schema({
   name : String,
   price : String,
   image : String,
   description : String,
   author:{
     id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     } ,
     username :String
   },
   comments:[
          {
              type:mongoose.Schema.Types.ObjectId,
              ref : "Comment"
          }
      ]
});

//when attraction is deleted, realted comment would be also deleted
attractionSchema.pre('remove', async function(next) {
   try{
   	await Comment.deleteMany({
   		_id: {
   			$in: this.comments
   		}
   	}); 
   	next();
   }catch(err){
      next.log(err);       
   }
});

module.exports = mongoose.model("Attraction",attractionSchema);

