const   Campground = require("../models/campground"),
        Comment = require("../models/comment");

// all the middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    Campground.findById(req.params.id,(err, foundCampground)=>{
        //is user logged in
            if(req.isAuthenticated()){
                if(err || !foundCampground){
                    res.render("/campgrounds")
                }else{
                    //does user own thee campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }else{
                        res.redirect("back");
                    }
                }
            }else{
                res.redirect("back");
            }
            //does user own campground
        //if not, redirect

    });
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    
        //is user logged in
            if(req.isAuthenticated()){
                Comment.findById(req.params.comment_id,(err, foundComment)=>{
                if(err || !foundComment){
                    req.flash("error","Comment not found!!");
                    res.redirect("back");
                }else{
                    //does user own thee campground
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error","You don't have permission to do that")
                        res.redirect("back");
                    }
                }})
            }else{
                req.flash("error","You need to be logged in to do that")
                res.redirect("back");
            }
            //does user own campground
        //if not, redirect

    
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login");

}



module.exports = middlewareObj;