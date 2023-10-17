const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessions = require("express-session")
const axios = require('axios')


const app = express();
const path=require('path');

const ejs = require("ejs")

app.use('/public', express.static(path.join(__dirname,'./static')));
app.set('view engine' , 'ejs');
app.use(sessions({
    secret:"ThisissecretKey",
    resave: false,
  saveUninitialized: true
}))

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

app.get("/submit" , function(req,res){
    res.sendFile(__dirname+"/static/button.html");
});

app.post("/submit" , function(req,res){
    console.log(Number(req.body.bounced_1));
    async function getdata(){
        
        var clientdata = {
            "Bounced_1": Number(req.body.bounced_1),
            "Bounced_count": Number(req.body.bounced_count),
            "MOB_tvs": Number(req.body.mob_tvs),
            "Bounced_count_repaying": Number(req.body.bounced_count_repaying),
            "EMI": Number(req.body.emi),
            " Loan_Amount": Number(req.body.loan_amount),
            "Tenure": Number(req.body.tenure),
            "Dealer_code_two_wheeler": Number(req.body.dealer_code),
            "Product_code_two_wheeler": req.body.product_code,
            "No_advanced_emi_paid": Number(req.body.no_advanced_emi_paid),
            "Rate_intrest": Number(req.body.rate_interest),
            "Gender": req.body.gender,
            "Employability_type": req.body.emp_type,
            "Age": Number(req.body.age),
            "No_loans": 9,
            "No_secured_loan": 6,
            "No_unsecured_loan": 3,
            "live_loan_amnt_sanctioned_secure": 55000,
            "Number of times 30 days past due in last 6 months": 0,
            "Number of times 60 days past due in last 6 months": 0,
            "Number of times 90 days past due in last 6 months": 0,
            "Tier": "1"
        }
        
    const result = await axios.post('http://127.0.0.1:5000/predict', clientdata);
    console.log(result.data);
    res.send(result.data);
    }

   getdata();
    
});

app.get("/form",function(req,res){
     if(req.session.authorized){
        res.sendFile(__dirname + "/static" + "/form.html");
     }
     else{
        res.redirect("/");
     }
})

app.post("/register",function(req,res){
    var name = req.body.regname;
    var email = req.body.regemail;
    var password1 = req.body.regpass;

    var user = new usr({email:email,password:password1});

   user.save().then(function(result ){
    req.session.user = result;
        req.session.authorized = true;
      res.redirect("/home");
   });

});

app.get("/home",function(req,res){
    if(req.session.authorized){
        res.sendFile(__dirname + "/static" + "/home.html");
     }
     else{
        res.redirect("/");
     }
})

app.post("/login",function(req,res){
    var username = req.body.username;
    var password1 = req.body.password;

    usr.find({ email: username,password:password1}).then(function(result){
       if(result.length!=0){
        req.session.user = result;
        req.session.authorized = true;
        
        res.redirect("/home");
        
        
       }
       else{
         res.redirect("/");
       }
    }); 
})

app.listen(3000,function(){
    console.log("server started on  3000");
})


// sample data

// var clientdata = {
//     "Bounced_1": 4,
//     "Bounced_count": 0,
//     "MOB_tvs": 100,
//     "Bounced_count_repaying": 0,
//     "EMI": 5500,
//     " Loan_Amount": 170700,
//     "Tenure": 30,
//     "Dealer_code_two_wheeler": 1346,
//     "Product_code_two_wheeler": "1",
//     "No_advanced_emi_paid": 0,
//     "Rate_intrest": 12.65,
//     "Gender": "1",
//     "Employability_type": "1",
//     "Age": 31,
//     "No_loans": 9,
//     "No_secured_loan": 6,
//     "No_unsecured_loan": 3,
//     "live_loan_amnt_sanctioned_secure": 55000,
//     "Number of times 30 days past due in last 6 months": 0,
//     "Number of times 60 days past due in last 6 months": 0,
//     "Number of times 90 days past due in last 6 months": 0,
//     "Tier": "1"
// }