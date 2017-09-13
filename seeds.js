var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud Best",
        image: "http://www.gstatic.com/webp/gallery/1.jpg",
        description: "Lorem Ipsum is dummy text which has no meaning however looks very similar to real text. ... Lorem ipsum is latin, slightly jumbled, the remnants of a passage from Cicero's 'De finibus bonorum et malorum' 1.10.32, which begins 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
    },
    {
        name: "Cloud Best",
        image: "http://www.gstatic.com/webp/gallery/1.jpg",
        description: "Lorem Ipsum is dummy text which has no meaning however looks very similar to real text. ... Lorem ipsum is latin, slightly jumbled, the remnants of a passage from Cicero's 'De finibus bonorum et malorum' 1.10.32, which begins 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
    },
    {
        name: "Cloud Best",
        image: "http://www.gstatic.com/webp/gallery/1.jpg",
        description: "Lorem Ipsum is dummy text which has no meaning however looks very similar to real text. ... Lorem ipsum is latin, slightly jumbled, the remnants of a passage from Cicero's 'De finibus bonorum et malorum' 1.10.32, which begins 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
    }
];

 function seedDB() {
     //Remove all campgrounds
    
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");

        //add a few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err)
                }   
                else {
                    console.log("add a campground");
                    //Create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "homer112444"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                // console.log("Created New Comment ");
                            }
                    });
                }
            });
        });
    });
    
  //add a few comments
}

module.exports = seedDB;