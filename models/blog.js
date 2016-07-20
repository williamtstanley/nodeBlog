var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comments = new Schema({
  body: {type: String, required: true},
})

var BlogSchema = new Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  comments: [Comments],
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
BlogSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// Format the date for display
BlogSchema.methods.formatedDate = function () {
  return this.created_at.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2-$1-$3');
}

var Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;


