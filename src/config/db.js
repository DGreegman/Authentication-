const mongoose = require('mongoose');
require('dotenv').config()

CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.iec4oco.mongodb.net/Authentication`
const connectDb = async() =>{
    try{
        const conn = await mongoose.connect(CONNECTION_STRING);
        console.log(`MongoDB connected: ${conn.connection.host} ${conn.connection.name}`);
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDb;