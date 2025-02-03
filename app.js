const express = require('express');
const app = express ();
const userModel = require('./models/user')
const postModel = require('./models/post')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.set("view engine" ,"ejs");

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.get('/',(req,res)=>{
    res.render('landing');

})

app.get('/register',(req,res)=>{
    res.render('register');

})


app.get('/login',(req,res)=>{
    res.render('login');

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
            
            let token = jwt.sign({email : email} , "shhhh");
            res.cookie ("token" , token);
            res.send("already logged in");
        })
    })


})

app.post('/login', async (req,res)=>{
    let{email , password } = req.body
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("something went wrong");

    bcrypt.compare(password, user.password , (err, result)=>{
        if (result) {
           
            let token = jwt.sign({email:user.email}, "shhhh");
            res.cookie("token" ,token);  
            res.status(200).redirect("profile");
            
        } 
        else res.send ("something went wrong");
    })

})

app.get("/logout" , (req,res)=>{
    res.cookie("token" ,"");  
    res.redirect('/');
})

app.get("/profile" ,isLoggedin, async (req,res)=>{
    let user = await userModel.findOne({email : req.user.email}).populate("posts");
    
    res.render('profile' , {user});
})

app.post("/post" , isLoggedin ,async (req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    let {content} = req.body;
    let post = await postModel.create({
        user: user._id ,
        content
    });

    user.posts.push(post._id);
    await user.save();

    
   res.redirect("profile")
   
 })




function isLoggedin(req, res, next) {
    if (!req.cookies.token || req.cookies.token === "") {
        res.redirect("/");
    } else {
        try {
            let data = jwt.verify(req.cookies.token, "shhhh");
            req.user = data;  
            next();     
        } catch (error) {
            res.status(401).send("Invalid token");
        }
    }
}


app.listen(3000);