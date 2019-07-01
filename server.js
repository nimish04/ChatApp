var path=require('path');
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static("public"));
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var Bcrypt = require("bcryptjs");

  io.on("connection", (socket) => {
    console.log("Socket is connected...")
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/register',function(req,res){
    res.sendFile(path.join(__dirname + '/public/register.html'))
  });

  app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/public/home.html'))
  });

  app.get('/login',function(req,res){
    res.sendFile(path.join(__dirname + '/public/login.html'))
  });

  app.post('/demo',function(req,res){
    req.body.pass = Bcrypt.hashSync(req.body.pass, 10);
   MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    // console.log(req.body.pass);

   dbo.collection('userprofile').findOne({ name: req.body.name}, function(err, user) {
             if(user ===null){
               res.end("Login invalid");
            }else if (user.name === req.body.name && Bcrypt.compare(user.pass,req.body.pass)){
            res.sendFile(path.join(__dirname + '/public/chat.html'))
            console.log(req.body.name);
            // console.log("correct");
          } else {
            // console.log("Credentials wrong");
            res.end("Login invalid");
          }
          db.close();

   });
 });
});


  app.post('/registerprofile',function(req,res){
    req.body.pass = Bcrypt.hashSync(req.body.pass, 10);
    // console.log(req.body.pass);

    MongoClient.connect(url, function(err, db) {

    var dbo = db.db("mydb");

   var obj = JSON.stringify(req.body);
  //  console.log("Final reg Data : " + obj);
   var jsonObj = JSON.parse(obj);
      
   dbo.collection('userprofile').findOne({name:req.body.name}, function(err,user){

    if(user === null)
    {
      // console.log("user is null")
      dbo.collection("userprofile").insertOne(jsonObj, function(err, res) {
        if (err) throw err;
        // console.log("1 document inserted");
        db.close();

         });
         res.sendFile(path.join(__dirname + '/public/chat.html'))
        // console.log("Successfully Registered");
    }

    else{
      // console.log(user + " exists");
      console.log("username is taken")
      // res.sendFile(path.join(__dirname + '/unsuccessful.html'))
    }
  });
    
      });
    });


var conString = "mongodb://localhost:27017/mydb";

// mongoose.Promise = Promise

var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

mongoose.connect(conString, (err) => {
    console.log("Database connection", err)
})

app.post("/chats",(req, res) => {

        var chat = new Chats(req.body)
        // console.log(chat)
        chat.save()
        // console.log(chat)
        res.send(chat)
        // console.log(chat.name + ":" , chat.chat)
        // $("messages").append(chat.name + ":" , chat.chat)
    });

app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
      // res.sendFile(path.join(__dirname + '/public/chat.html'))
      res.send(chats)
        // console.log(chats)

    });

app.get("/chat",(req,res) => {

    res.sendFile(path.join(__dirname + '/public/chat.html'))
    });
});

server.listen(3000);
console.log("Working");


