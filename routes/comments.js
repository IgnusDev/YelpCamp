const   express =   require("express"),
        router  =   express.Router({mergeParams: true}),
        Campground = require("../models/campground"),
        Comment = require("../models/comment"),
        middleware = require("../middleware");


//========================================
//COMMENTS ROUTES
//========================================

//COMMENT NEW ROUTE
router.get("/new",middleware.isLoggedIn,(req, res)=>{
    //find campground by id
    Campground.findById(req.params.id,(err, campground)=>{
        if(err){
            req.flash("error","Something went wrong")
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })
})

//COMMENT CREATE ROUTE
router.post("/", middleware.isLoggedIn,(req, res)=>{
    //look up campground using id
    Campground.findById(req.params.id,(err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,(err, comment)=>{
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","You posted a comment!")
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//COMMENT EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req, res)=>{
    Campground.findById(req.params.id,(err, foundCampground)=>{
            if(err || !foundCampground){
                req.flash("error","Cannot find Campground");
                return res.redirect("back");
            }
                Comment.findById(req.params.comment_id,(err, foundComment)=>{
            if(err){
                req.flash("err", "Comment not found");
                res.render("back");
            }else{
                 res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });

   
});

//COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,(req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err, updatedComments)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENT DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,(req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});





module.exports = router;

