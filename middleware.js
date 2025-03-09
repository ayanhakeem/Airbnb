const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");//require review schema



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){//check user logged or not before add newlisting
        req.session.redirectUrl=req.originalUrl;//redirect to same originalurl before login
        req.flash("error","you must be logged in to create new listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;//save original url in locals to use 
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){//curruser==owner then only can edit
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//validate listing
module.exports.validateListing=(req,res,next)=>{
        let {error}=listingSchema.validate(req.body);//joi handles error of individual and send error msg of all if condition fails means not des,title
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");//additional details in err combine seaorate with , 
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
    };


//validate review middleware
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);//joi handles error of individual and send error msg of all if condition fails means not des,title
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");//additional details in err combine seaorate with , 
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//check review author
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){//curruser==owner then only can edit
        req.flash("error","You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};