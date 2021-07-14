var express = require('express');
var cors = require('cors');
var monk = require ('monk');
var Filter = require('bad-words');
var rateLimit = require('express-rate-limit');


var app = express();

// var db = monk('localhost/meower') 
var db = monk(process.env.MONGO_URI || 'localhost/meower');
//= connect to mongodb on my local machine in a database that i'm calling 'meower'
var mews = db.get("mews") //mews is a collection inside our database
var filter = new Filter();


app.use(cors());//cors policy ayant deux serveurs qui communiquent (live server et local 5000)
app.use(express.json());//middleware qui parse le json que l'on reçoit depuis le form (voir post ds client)


app.get("/", (req, res)=>{
    res.json({
        message:'meower'
    })
})

app.get('/mews', (req, res)=>{ //création de la database via la get request de l'url /mews
    mews
    .find() 
    .then(mews=>{
        res.json(mews)
    })
})

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&  mew.content && mew.content.toString().trim() !== '' 
}

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs(100 requests / 15 minutes)
  }));

app.post("/mews", (req, res)=>{
    if(isValidMew(req.body)){
        var mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date() 
        }
        mews 
        .insert(mew)
        .then(createdMew => {
            res.json(createdMew)

        })
    }
    else{
        res.status(422);
        res.json({
            message: "Hey! Name and content are required "
        })
    }


})


app.listen(5000, ()=>{
    console.log('listening on http://localhost:5000')
})