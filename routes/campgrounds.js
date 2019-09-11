var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");



// route 
router.get("/", function(req, res){
    //Get all campgrounds
    console.log(req.user);
    campground.find({}, function(err, allCampgrounds){
        
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
        
});
//create route
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated)
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});

//SHOW- info about campground
router.get("/:id", function(req, res){
    //find campgrounds with ID
    console.log("printing "+ campground.findById(req.params.id));
    campground.findById(req.params.id).populate("comments").exec (function(err, foundCampground){
         if(err){
            console.log(err);
        }else{
            
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
  
});

//Edit campground route
router.get("/:id/edit", middleware.checkGroundcampOwnership, function(req, res) {
    //if user is logged in
    
        campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
                
        });
    
});
// update campground route
router.put("/:id", middleware.checkGroundcampOwnership, function(req, res){
    
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    }) ;
});
// delete campground route
router.delete("/:id", middleware.checkGroundcampOwnership, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds")
        }
    });
});





module.exports = router;