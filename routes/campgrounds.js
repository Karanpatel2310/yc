var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); 

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampground });
        }
    });
    // res.render("campgrounds",{campgrounds:campgrounds});
});

//CREATE ROUTE - ADD NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    // res.send("YOU HIT THE POST ROUTE");

    //get data from form and add to the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author }
    // console.log(req.user);
    // campgrounds.push(newCampground);

    //Create a new campground and save to Db
    Campground.create(newCampground, function(err, NewlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(NewlyCreated);
            res.redirect("/campgrounds");
        }
    });
    //also redirect to campgrounds page
    // res.redirect("/campgrounds");
});

//NEW ROUTE - SHOW A FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW ROUTE - SHOWS MORE INFO ABOUT A ONE CAMPGROUND
router.get("/:id", function (req, res) {
    //Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
    //res.send("THIS WILL BE THE SHOW PAGE ONE DAY!");
    // res.render("show");
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwenership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwenership, function (req, res) {
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //Redirect somewhere
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE/DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwenership, function (req, res) {
    // res.send("Delete something");
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;