var express = require("express");
var mongoose = require("mongoose");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//================================
//COMMENTS ROUTE
//================================

//Commments New
router.get("/new", middleware.isLoggedIn,  function (req, res) {
    //find campgrounds by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup campground using ID
    // console.log(req.params);
    Campground.findById(mongoose.Types.ObjectId(req.params.id), function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                    // console.log(err,comment, campground);
                    if (err) {
                        req.flash("error", "Something went wrong");
                        console.log(err);
                    } else {
                        //add username and id to comment
                        // console.log("New comment's username will be: " + req.user.username);
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //save comment
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        console.log(comment);
                        req.flash("error", "Successfully Added Comment");
                        res.redirect('/campgrounds/' + campground._id);
                    }
                });
        }
    });
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCoomentOwenership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCoomentOwenership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//COMMENT DELETE ROUTE
router.delete("/:comment_id", middleware.checkCoomentOwenership, function(req, res){
    //Find BId and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;