const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/quickchirp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const postSchema = mongoose.Schema({

    user: {
        type : mongoose.Schema.Types.ObjectId , ref: "user"
    },

    date: {
        type : Date ,
        default : Date.now
    },
    content : String ,
    title : String
    

});

module.exports = mongoose.model("post" , postSchema);