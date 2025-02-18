const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/quickchirp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    password: String,
    email: String,
    age: Number,
    profilepic: {
        type: String,
        default: "placeholder.webp"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'post'
    }]
});

module.exports = mongoose.model("user", userSchema);