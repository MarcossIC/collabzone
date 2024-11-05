const mongoose = require ("mongoose")
const dotenv = require('dotenv')

dotenv.config({
    path:'../.env'
})

const connectDB = async () => {
    try {
        console.log("as")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("conect dbs")
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectDB;