var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Router
router.get("/", function (req, res) {
    res.render("landing");
});

// ===================
// AUTH Route
// ===================

//Show register form
router.get("/register", function(req, res){
    res.render("register");
});

//Handle sign up logic
router.post("/register", function(req, res){
    // res.send("YOu Signed in..");
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            // console.log(err);    
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);            
                res.redirect("/campgrounds");
        
            });
        }
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login");
});

router.get("/login/failure", function(req, res){
    req.flash("error","Invalid Usernmae or Password");
    res.redirect("/login");
});

//Handling login logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login/failure",
    }), function(req, res){
});

//logout Logic Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You successfully Logged Out");
    res.redirect("/login");
});

module.exports = router;
