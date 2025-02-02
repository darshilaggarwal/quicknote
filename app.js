const express = require('express');
const app = express ();
const userModel = require('./models/user')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine" ,"ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.render('index');

})

app.post('/register', async (req,res)=>{
    let{email , password , username , name , age } = req.body
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("user already registered");

    bcrypt.genSalt(10 , (err,salt)=>{
        bcrypt.hash(password, salt ,async (err,hash)=>{
            let createdUser = await userModel.create({
                username ,
                age ,
                name ,
                email ,
                password: hash,
            })
            
            let token = jwt.sign({email: email} , "shhhh");
            res.cookie ("token" , token);
            res.send("you are registered");
        })
    })


})


app.listen(3000);