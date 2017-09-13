var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwenership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                // console.log(err);
                res.redirect("back");
            } else {
                // Dose user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    //  res.render("campgrounds/edit", {campground: foundCampground});
                    next();
                } else {
                    req.flash("You Do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("You need to be logged in to do that");
        // res.send("You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCoomentOwenership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                // console.log(err);
                res.redirect("back");
            } else {
                // Dose user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    //  res.render("campgrounds/edit", {campground: foundCampground});
                    next();
                } else {
                    req.flash("error","You DO not permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("You need to be logged in to do that");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

module.exports = middlewareObj;