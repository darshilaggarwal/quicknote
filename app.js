const express = require('express');
const app = express ();
const userModel = require('./models/user')
const postModel = require('./models/post')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
// const multerconfig = require('./config/multer');
const upload = require('./config/multer');
// const { log } = require('console');
// const { path } = require('framer-motion/client');


app.set("view engine" ,"ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.get('/',(req,res)=>{
    res.render('landing');

})

app.get('/register',(req,res)=>{
    res.render('register');

})

app.get('/notes',  isLoggedin , async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email}).populate("posts");
    
    res.render('notes' , {user});

})



app.get('/login',(req,res)=>{
    res.render('login');

})

app.get('/test',(req,res)=>{
    res.render('test');

})

app.get('/profile/upload',isLoggedin,(req,res)=>{
    res.render('editprofile');

})

app.post('/upload', isLoggedin, upload.single("image"), async (req, res) => { 
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).send("No file uploaded. Please select an image.");
    }

    let user = await userModel.findOne({ email: req.user.email });
    user.profilepic = req.file.filename;
    await user.save();

    res.redirect("profile");



});




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
            res.redirect("profile");
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
    let {content , title} = req.body;
    let post = await postModel.create({
        user: user._id ,
        title,
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

app.post("/delete/:postId", isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        const postId = req.params.postId;

        await postModel.findByIdAndDelete(postId);

        user.posts = user.posts.filter(post => post.toString() !== postId);
        await user.save();

        res.redirect("/notes");
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/post/:postId", isLoggedin, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render("viewPost", { post }); 
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/edit/:postId', isLoggedin, async (req, res) => {
    const postId = req.params.postId;
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('editPost', { post });
});

app.post('/edit/:postId', isLoggedin, async (req, res) => {
    const postId = req.params.postId;
    const { title, content } = req.body;

    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    // Update the post with the new data
    post.title = title;
    post.content = content;
    
    await post.save();
    
    // Redirect back to profile or view the updated post
    res.redirect('/notes');
});



app.listen(3000);