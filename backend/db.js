const mongoose = require('mongoose')
const mongoURI =  "mongodb://localhost:27017/inotebook"

mongoose.set("strictQuery", false);
const connectToMongo = async() =>{
    mongoose.connect(mongoURI,() =>{
        console.log("connected to mongo sucessfully")
    })
}

module.exports = connectToMongo;