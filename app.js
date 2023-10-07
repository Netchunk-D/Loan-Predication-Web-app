const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const path=require('path');

const ejs = require("ejs")

app.use('/public', express.static(path.join(__dirname,'./static')));
app.set('view engine' , 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/TVScreditloginDB",{useNewUrlParser: true})

const loginSchema = new mongoose.Schema({
    email:String,
    password:String
})

const usr = new mongoose.model("users" , loginSchema);





app.get("/" , function(req,res){
    res.sendFile(__dirname+"/static/index.html");
});

app.post("/register",function(req,res){
    var name = req.body.regname;
    var email = req.body.regemail;
    var password1 = req.body.regpass;

    var user = new usr({email:email,password:password1});

   user.save().then(function(){
      res.sendFile(__dirname + "/static" + "/form.html");
   });

});

app.post("/login",function(req,res){
    var username = req.body.username;
    var password1 = req.body.password;

    usr.find({ email: username,password:password1}).then(function(result){
       if(result.length!=0){
        res.sendFile(__dirname + "/static" + "/form.html");
        console.log(result);
       }
       else{
         res.redirect("/");
       }
    }); 
})

app.listen(3000,function(){
    console.log("server started on  3000");
})