require("dotenv").config();

const express = require('express')
const app = express();
const db = require('./config/db')()
const files = require('./routes/file')
const path = require('path')

const PORT = process.env.PORT ||  8080;

app.use(express.static('public'))


// template

app.set('views' ,path.join(__dirname , '/views'))
app.set('view engine' , 'ejs')





// init routes


app.use('/api/files', files)




app.use('/' , (req,res)=>{
    return res.json({
        "status" : "true"
    })
})



app.listen(PORT , () => {
    console.log(`server is runnnig at PORT ${PORT} `);
})