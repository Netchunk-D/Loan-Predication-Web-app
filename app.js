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
            "Rate_intrest":parseFloat(req.body.rate_interest),
            "Gender": req.body.gender,
            "Employability_type": req.body.emp_type,
            "Age": Number(req.body.age),
            "No_loans": Number(req.body.no_loans),
            "No_secured_loan":Number(req.body.no_secured_loan),
            "No_unsecured_loan": Number(req.body.no_unsecured_loan),
            "live_loan_amnt_sanctioned_secure": Number(req.body.live_loan_amnt_sanctioned_secure),
            "Number of times 30 days past due in last 6 months": Number(req.body.past_due),
            "Number of times 60 days past due in last 6 months": Number(req.body.past_due_1),
            "Number of times 90 days past due in last 6 months": Number(req.body.past_due_2),
            "Tier": "1"
        }
        
    const result = await axios.post('http://127.0.0.1:5000/predict', clientdata);
    console.log(result.data);
    if(result.data.prediction==1){
        res.sendFile(__dirname + "/static" + "/noteligible.html");
    }
    else{
        res.sendFile(__dirname + "/static" + "/eligible.html");

    }
    }
   if(req.session.authorized) getdata();
   else res.redirect("/");
    
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

app.post("/logout",function(req,res){
    if(req.session.authorized){
     req.session.destroy();
    }
     res.redirect("/home");
})

app.get("/personalform",function(req,res){
    if(req.session.authorized){
    res.sendFile(__dirname + "/static" + "/Personal_form.html");
    }
    else{
        res.redirect("/");
    }
})

app.post("/personalform",function(req,res){
    if(req.session.authorized){
        async function getdata(){
        
            var clientdata = {
                "RevolvingUtilizationOfUnsecuredLines": parseFloat(req.body.revolving_utilization), 
                "age": Number(req.body.age),
                "NumberOfTime30-59DaysPastDueNotWorse": Number(req.body.past_due), 
                "DebtRatio": parseFloat(req.body.deb_ratio), 
                "MonthlyIncome": Number(req.body.monthly_income), 
                "NumberOfOpenCreditLinesAndLoans": Number(req.body.credit_lines), 
                "NumberOfTimes90DaysLate":Number(req.body.past_due_2), 
                "NumberRealEstateLoansOrLines": Number(req.body.real_estate),
                 "NumberOfTime60-89DaysPastDueNotWorse": Number(req.body.past_due_1), 
                 "NumberOfDependents": Number(req.body.no_of_dependents)
            }
            
        const result = await axios.post('http://127.0.0.1:5001/predict', clientdata);
        console.log(result.data);
        if(result.data.voted_result[0]==1){
            res.sendFile(__dirname + "/static" + "/noteligible.html");
        }
        else{
            res.sendFile(__dirname + "/static" + "/eligible.html");
            
        }
        //res.send(result.data.voted_result[0]);
        }

        getdata();
        
    }
    else{
        res.redirect("/");
    }
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

// { "RevolvingUtilizationOfUnsecuredLines": 0.964673, 
// "age": 40,
//  "NumberOfTime30-59DaysPastDueNotWorse": 3, 
// "DebtRatio": 0.382965, "MonthlyIncome": 13700, 
// "NumberOfOpenCreditLinesAndLoans": 9, "NumberOfTimes90DaysLate": 3, 
// "NumberRealEstateLoansOrLines": 1, "NumberOfTime60-89DaysPastDueNotWorse": 1, "NumberOfDependents": 2 }