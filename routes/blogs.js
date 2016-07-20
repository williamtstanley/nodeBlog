var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");

//code goes here
// Index
router.get("/", function(request, response, next){
  Blog.find(function(err, blogs){
    if(err){
      err.status = 404;
      next(err, response, request);
    }else{
      response.render("blogs/index", {blogs: blogs});
    }
  });
});

// New
router.get("/new", function(request, response){
  response.render("blogs/new", {errors: {}, blog:{}} );
});

// Create
router.post("/", function(request, response){
  var params = request.body;
  var blog = new Blog({title: params.title, body: params.body});
  blog.save(function(err, blog){
    if(err){
      console.log(err);
      response.render("blogs/new", {errors: err.errors, blog: params});
    }else{
      response.redirect("/blogs/" + blog._id);
    }
  });
});

//Show
router.get("/:id", function(request, response, next){
  Blog.findOne({_id: request.params.id}, function(err, blog){
    if(err){
      err.status = 404;
      next(err, request, response)
    } else {
      response.render("blogs/show", {blog: blog});
    }
  });
});

//Edit Page
router.get("/:id/edit", function(request, response){
  Blog.findOne({_id: request.params.id}, function(err, blog){
    if(err) {
      response.render('error', {message: "Blog not found",
                           error: {status: 404}});
    } else {
      response.render("blogs/edit", {blog: blog, errors: {}});
    }
  });
});
//Update
router.patch("/:id", function(request, response){
  Blog.findOne({_id: request.params.id}, function(err, blog){
    var params = request.body
    if(err) {
      response.render('error', {message: "Blog not found",
                           error: {status: 404}});
    } else {
      blog.title = params.title;
      blog.body  = params.body;
      blog.save(function(err, blog){
        if(err) {
          response.render("blogs/edit", {errors: err.errors, blog: blog});
        } else {
          response.redirect("/blogs/" + blog._id);
        }
      });
    }
  });
});
//Delete
router.delete("/:id", function(request, response){
  Blog.remove({_id:request.params.id}, function(err, blog){
    if(err){
      response.render("blogs/" + blog.id, {errors: err.errors, blog: blog});
    } else {
      response.redirect("/blogs");
    }
  });
});

//Add Comment
router.post("/:id/add_comment", function(request, response){
  var commentParams = request.body
  Blog.findOne({_id: request.params.id}, function(err, blog){
    if(err) {
      response.render('error', {message: "Blog not found",
                           error: {status: 404}});
    } else {
      blog.comments.push({body: commentParams.body})
      blog.save(function(err){
        if (err){
            err.status = 404;
            next(err, request, response);
        } else {
          console.log("Comment Success!")
          response.redirect("/blogs/" + blog._id);
        }
      });
    }
  }); 
});


module.exports = router;
