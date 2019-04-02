const   express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStradegy = require("passport-local"),
        methodOverride = require("method-override"),
        Campground = require("./models/campground"),
        Comment = require("./models/comment"),
        flash = require("connect-flash"),
        User = require("./models/user")
   //     seedDB = require("./seeds")
        
const commentRoutes         = require("./routes/comments"),
        campgroundRoutes    = require("./routes/campgrounds"),
        indexRoutes          = require("./routes/index")


//seedDB()  //seed the database

mongoose.connect("mongodb://localhost:27017/yelp_camp_v13", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//linked to the public directory to use ccs files and front end js 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Hemi is sorta the best dog ever",
    resave:false,
    saveUninitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStradegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//FLASH
app.use(flash());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




// Campground.create({
//     name:"Granite Hill", 
//     image:"https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
//     description: "Fun happy place to camp!!!"
    
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("newly created campgorund");
//             console.log(campground);
//         }
//     });
    
    app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started");
});