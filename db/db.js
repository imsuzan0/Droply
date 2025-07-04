const mongoose = require("mongoose");

 const connectDb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to DB ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in connecting to DB",error);
        process.exit(1);
    }
}

module.exports=connectDb
