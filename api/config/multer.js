const multer = require("multer");
const path = require('path');
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12 ,(err , name)=>{

            const fn = name.toString("hex")+path.extname(file.originalname);
            cb(null, fn);


        })
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;