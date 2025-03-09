const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const { isLoggedIn , isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');//multer for parse data or file
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });//save in storage folder



router.
route("/")
.get(wrapAsync(listingController.index))//create & index route
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewform);//callback for new route

router.
route("/:id")
.get(wrapAsync(listingController.showListing))//show
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))//update
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//delete


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditform));


module.exports=router;