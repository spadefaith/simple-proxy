const express = require('express');
var proxy = require('express-http-proxy');
const app = express();
const fs = require('fs');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.post('/_set_url',(req,res,next)=>{
    try {
        console.log(11,req.body);
        fs.writeFileSync(path.join(__dirname,'conf.json'),JSON.stringify({
            url:req.body.url|| ''
        },null,4))
        res.json({status:1})
    } catch(err){
        next(err);
    }
});

app.use('/',(req,res,next)=>{
    try {
        const filePath = path.join(__dirname,'conf.json');
        if(!fs.existsSync(filePath)){
            throw new Error('config not found');
        }
        let config = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
        proxy(config.url)(req,res,next)

      
    } catch(err){
        next(err);
    }
    
})


app.listen(8003,(err)=>{
    if(err){
        return console.error(err)
    }
    console.log('listening to port '+8003)
})


app.use((error, req,res,next)=>{
    res.json({
        status:0,
        message:error.message
    })
})