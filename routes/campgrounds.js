const   express =   require("express"),
        router  =   express.Router(),
        Campground = require("../models/campground"),
        middleware = require("../middleware");  

//INDEX
router.get("/", (req, res) => {
   //Get all campgrounds from db
   Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/Index",{campgrounds: allCampgrounds, currentUser:req.user });
       }
   })
})

//NEW --
router.get("/new",middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})



//CREATE -- add new campground to db
router.post("/", middleware.isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    var name =  req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price: price, image: image, description: description, author: author};
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            
            //redirect back to campgorunds page
            res.redirect("/campgrounds");
        }
    })

    
})

//SHOW - shows more info on one campground
router.get("/:id", function(req, res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found")
            res.redirect("back");
        }else{
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

})

//EDIT - show edit form for a campground
router.get("/:id/edit",middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id,(err, foundCampground)=>{
        if(err){
            res.redirect("/campgrounds")
        }else{
               res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
});


//UPDATE - updates the campground
 router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
     Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
         if(err){
             res.redirect("/campgrounds");
         }else{
             res.redirect("/campgrounds/" + req.params.id);
         }
     })
 });
 
 //DESTROY - deletes a campground
 router.delete("/:id",middleware.checkCampgroundOwnership, (req, res)=>{
     Campground.findByIdAndRemove(req.params.id, (err)=>{
         if(err){
             res.redirect("/campgrounds");
         }else{
             res.redirect("/campgrounds");
         }
     });
 });




module.exports = router;