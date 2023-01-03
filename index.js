require("dotenv").config();

const express = require('express')
const app = express();
const db = require('./config/db')()
const files = require('./routes/file')
const path = require('path')
const cors = require('cors')

const PORT = process.env.PORT ||  8080;

app.use(express.static('public'))
app.use(express.json())


// template

app.set('views' ,path.join(__dirname , '/views'))
app.set('view engine' , 'ejs')


// init routes


app.get('/' , (req , res) =>{
    return res.render('home');
})
app.use('/api/files', files)


app.listen(PORT , () => {
    console.log(`server is runnnig at PORT ${PORT} `);
})