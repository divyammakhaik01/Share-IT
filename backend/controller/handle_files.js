const db = require("../config/db")
const multer = require("multer")
const path = require('path')
const File = require('../model/file')
const {v4 : uuidv4} = require("uuid")
const { resourceLimits } = require("worker_threads")
// const file = require("../model/file")



// config multer

let store = multer.diskStorage({
    destination : (req , file , cb)=>{
        // store files here  
        cb(null , 'uploads/') 
    } , 
    filename : (req , file , cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueName  = `${uniqueSuffix}${path.extname(file.originalname)}`;
        
        cb(null, uniqueName)
        
    }
})


let upload = multer({
    storage : store , 
    limit : {
        fileSize : 100000 * 200 //200 MB
    }
}).single('file')



const upload_file = (req,res) =>{

    upload(req , res , async (err)=>{
        if(err){
            return res.status(500).json({
                "status" : "false" , 
                "error" : err.message
            })
        }


        const user_file =  await File.create({
            filename : req.file.filename , 
            id : uuidv4() , 
            path : req.file.path , 
            fileSize : req.file.size 
        }) 
 
        return res.json({
            "status" : "true" , 
            "message" :  `${process.env.APP_BASE_URL}/files/${user_file.id}/}`
        })

        
    })

}

const downlode_page = async (req , res) => {

    try {

        const file = await File.findOne({id : req.params.id})
        console.log(file);

        if(!file){
            return res.render('downlode_page' , {
                error : "file not present"
            })   
        }

        return res.render('downlode_page' , {
            id: file.id , 
            name : file.filename , 
            size : file.fileSize , 
            download_link : `${process.env.APP_BASE_URL}/files/download/${file.id}`
        })

        
    } catch (error) {

        return res.render('downlode_page' , {
            error : "server error"
        })
        
        // return res.json({
        //     "status" : "false" , 
        //     "message" : error
        // })
    }


}


const downlode_file = async (req , res) =>{
    try {
        const file = await File.findOne({id : req.params.id})

        if(!file){
            return res.render('downlode_page' , {
                error : "file not present"
            })   
        }

        const filePath = `${__dirname}/../${file.path}`
        console.log("download " , filePath);
        res.download(filePath)
        
    } catch (error) {
        return res.render('downlode_page' , {"error" : error} )
    }
}


module.exports = {
    upload_file , 
    downlode_file ,
    downlode_page
}