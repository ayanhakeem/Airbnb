const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(MONGO_URL);//connection
}

const initDB = async()=>{
    await Listing.deleteMany({});//clear all data first
    initData.data=initData.data.map((obj)=>({...obj,owner:"679275f1395642fc25c12007"}));//for each single obj add owner property while initializing
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
