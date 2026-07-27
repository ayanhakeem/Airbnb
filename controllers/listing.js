const Listing=require("../models/listing");//listing model
const axios = require('axios');

async function geocode(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (response.data && response.data.length > 0) {
            const lat = parseFloat(response.data[0].lat);
            const lon = parseFloat(response.data[0].lon);
            return {
                type: 'Point',
                coordinates: [lon, lat]
            };
        }
    } catch (e) {
        console.error("Geocoding failed:", e.message);
    }
    // Fallback coordinates (Delhi)
    return {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
    };
}

module.exports.index=async(req,res)=>{
    const { q } = req.query;
    let allListings;
    
    if (q) {
        // Find listings matching title, location, or country
        allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    
    res.render("listings/index.ejs",{ allListings });//render ,listings
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
    try {
        let url=req.file.path;
        let filename=req.file.filename;//access from req 
        const newListing= new Listing(req.body.listing);
        newListing.owner=req.user._id;//curr user id stored
        newListing.image={url,filename};//add in image
        
        // Geocode
        newListing.geometry = await geocode(req.body.listing.location, req.body.listing.country);
        
        await newListing.save();
        req.flash("success","New Listing Created Successfully!");
        res.redirect("/listings");//redirect to listing page
    } catch (e) {
        next(e);
    }
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

module.exports.updateListing=async(req,res,next)=>{
    try {
        let {id}=req.params;
        let geometry = await geocode(req.body.listing.location, req.body.listing.country);
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing, geometry}, {new: true});
        if(typeof req.file!=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image={url,filename};
            await listing.save();
        }
        req.flash("success","Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        next(e);
    }
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};

module.exports.apiGeoJSON = async (req, res) => {
    try {
        const listings = await Listing.find({ geometry: { $exists: true } });
        res.json(listings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports.apiSearch = async (req, res) => {
    try {
        const { type, lat, lng, north, south, east, west } = req.query;
        let query = {};
        
        if (type === 'nearMe' && lat && lng) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            query = {
                geometry: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 50000
                    }
                }
            };
        } else if (type === 'area' && north && south && east && west) {
            const n = parseFloat(north);
            const s = parseFloat(south);
            const e = parseFloat(east);
            const w = parseFloat(west);
            query = {
                geometry: {
                    $geoWithin: {
                        $box: [
                            [w, s],
                            [e, n]
                        ]
                    }
                }
            };
        }

        const listings = await Listing.find(query);
        res.json(listings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};