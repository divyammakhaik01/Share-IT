const db = require("../config/db")
const multer = require("multer")
const path = require('path')
const fs = require('fs')
const File = require('../model/file')
const {v4 : uuidv4} = require("uuid")
const { resourceLimits } = require("worker_threads")
const sendMail = require("../services/mailServices")
const mailTemplate = require("../services/mailTemplate")

// config multer

let store = multer.diskStorage({
    destination : (req , file , cb)=>{
        // store files here  
        let fs = require('fs');
        let dir = './uploads';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        cb(null , 'uploads/') 
    } , 
    filename : (req , file , cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueName  = `${uniqueSuffix}${path.extname(file.originalname)}`;

        if(!file){
            return res.json({
                "status": "false",
                "message" : "no file found "
            })
        }
        
        cb(null, uniqueName)
        
    }
})


let upload = multer({
    storage : store , 
    limit : {
        fileSize : 100000 * 200 //200 MB
    }
}).single('file')


// upload file 
const upload_file = (req,res) =>{

    upload(req , res , async (err)=>{
        // 
        if(err){
            return res.status(500).json({
                "status" : "false" , 
                "error" : err.message
            })
        }   

        if(!req.file){
            return res.json({
                "status": "false",
                "message" : "no file found "
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
            "message" :  `${process.env.APP_BASE_URL}/api/files/${user_file.id}/}`
        })

        
    })

}

// redirect to downlode page
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
            download_link : `${process.env.APP_BASE_URL}/api/files/download/${file.id}`
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


// download file 
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


const send_Mail = async (req , res) =>{ 

    const {id , MailTo , MailFrom} = req.body ;

    console.log(id , '      ' , MailFrom , '   ' , MailTo);

    if(id === undefined || id === ''){
        return res.json({
            "status" :"false" , 
            "message" : "id not found"
        })
    }
    
    // validation
    
    if(!id || !MailFrom  || !MailTo){
        return res.status(422).json({
            error : "All fields are required"
        })
    }
    console.log(id);

    const file = await File.find({id: id});

    console.log(":::::::::   " , file);

    if(!file){
        return res.json({
            "error" : "File not found !!"
        })
    }

    if(file.sender){
        return res.json({
            "error" : "mail already sent"
        })
    }

    console.log("here");

    const updated_file = await File.findByIdAndUpdate(file[0]._id , {
        sender : MailFrom , 
        receiver : MailTo
    } , {
        new:true
    })
    
    // file.sender = MailFrom ;
    // file.receiver = MailTo ;

    // const result = await file.save();
    console.log(":  " , updated_file);

    sendMail({
        from : MailFrom , 
        to : MailTo , 
        subject : "Share-IT", 
        text : `${MailFrom} send a file `,
        html : mailTemplate({
            from : MailFrom , 
            downlodeLink : `${process.env.APP_BASE_URL}/api/files/download/${file[0].id}` , 
            size : parseInt(file[0].fileSize/1000) + ' KB' , 
            expire : "24 hours"
        })
    })


    return res.json({
        "status" :"true" ,
        "message" : "mail sent successfully "
    })


    
    

}



module.exports = {
    upload_file , 
    downlode_file ,
    downlode_page , 
    send_Mail
}