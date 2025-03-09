const express=require("express");
const router=express.Router();//merge parent id to child 
const User=require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupform)
.post(wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectUrl,passport.authenticate("local",{//authenticate check if user is valid or not if in valid redirect to login page again and flash msg
    failureRedirect:"/login",
    failureFlash:true,
}),userController.login);//passport login auto



router.get("/logout",userController.logout);
    

module.exports=router;