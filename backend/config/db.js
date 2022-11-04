require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

const db = () =>{
mongoose.connect(url);
const conn  = mongoose.connection;
conn.once('open' , () => {
    console.log("database connected ");
})
conn.on('error' , (error)=>{
    console.log("error : " ,  error);
})

}

module.exports = db;