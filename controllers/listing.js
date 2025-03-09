const Listing=require("../models/listing");//listing model


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{ allListings });//render all ,listings
};



module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs")

}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",//nested populate for author print
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does ot exist!");//listing not exist redirect to home lstings page
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{//first validate then create used as middleware 
    let url=req.file.path;
    let filename=req.file.filename;//access from req 
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;//curr user id stored
    newListing.image={url,filename};//add in image
    await newListing.save();
    req.flash("success","New Listing Created Successfully!");
    res.redirect("/listings");//redirect to listing page
};


module.exports.renderEditform=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does ot exist!");//listing not exist redirect to home lstings page
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");//replace or edit img like blur , ht,wt
    res.render("listings/edit.ejs",{listing,originalImageUrl});

};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};