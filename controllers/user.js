const User=require("../models/user");//model db requires


module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }  
};

module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");//render to login page
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";//if local is empty redirect to listings page when we login
    res.redirect(redirectUrl);

};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};
