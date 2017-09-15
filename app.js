var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    seedDB        = require("./seeds"),
    passport      = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user"),
    flash         = require("connect-flash");

    global.basepath = __dirname;


//Requiring Route
var commentRoutes    = require("./routes/comments.js"),
    campgroundRoutes = require("./routes/campgrounds.js"),
    indexRoutes      = require("./routes/index.js")

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();//Seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "Best Of luck",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); 
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function () {
    console.log("YelpCamp Server has started");
});