const db = require('../config/db')
const mongoose = require("mongoose")


const Schema = mongoose.Schema;


const fileSchema = new Schema({

    filename : {
        type:String , 
        required : true
    } , 

    path : {
        type : String , 
        required : true 
    } , 

    fileSize : {
        type : Number , 
        required : true
    } , 

    id : {
        type : String ,
        required : true
    } , 

    sender : {
        type : String  ,
        required : false
    } ,
    receiver : {
        type : String ,
        required : false
    }

    
} , {timestamps : true})


module.exports = mongoose.model('File' , fileSchema)