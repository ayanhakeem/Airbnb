if(process.env.NODE_ENV!="production"){//if not equal to production we can .env file
    require('dotenv').config();
}
//access .env file credentials


const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");//require route filr
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const isLoggedIn=require("./middleware.js");





/* const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"; */               //local db
const dbUrl=process.env.ATLASDB_URL;//connect to atlas cloud  db not our local db

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,//update after 24 hrs even we have not change anything ex login
});


store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
}); 

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//expire date 1 week from now in miiliseconds
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

/* app.get("/",(req,res)=>{
    res.send("i am root");
}); */


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());//user login for once so we use sessions
passport.use(new LocalStrategy(User.authenticate()));//static method of password-local -mongoose for autentication function

passport.serializeUser(User.serializeUser());//store user into session
passport.deserializeUser(User.deserializeUser());//unstore user from session


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");//middleware to set success msg
    res.locals.error=req.flash("error");//middleware to set error msg
    res.locals.currUser=req.user;//info of curr user logged in
    next();
});




app.use("/listings",listingRouter);//use route file
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);




//all route diff from created api ex-random
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(8080,()=>{
    console.log("app listning to server 8080");
});