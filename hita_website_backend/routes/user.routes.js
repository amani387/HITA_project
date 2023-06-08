let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  { v4: uuidv4 } = require("uuid"),
  fs=require("fs");
  objectid = require("objectid");
router = express.Router();
// User model
let User = require("../models/model");
let admin = require("../models/adminSchema");


const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const pwd = req.body.pwd;

  const response = await admin.find({ username, pwd });
  if (response.length === 0) res.send("notfound");
  else res.send("found");
});

router.post("/add-carousel", upload.single("profileImg"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,

    Photo: url + "/public/" + req.file.filename,
    msg: req.body.msg,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User registered successfully!",
        userCreated: {
          _id: result._id,
          Photo: result.profileImg,
        },
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

 

router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;

  const file=await User.find({_id:new objectid(id)});
  const fileDelete="./public/"+(file[0].Photo).toString().slice(29);
   fs.unlink(fileDelete,(err)=>{
     if(err){console.log(err)}
     console.log(`${fileDelete} was deleted`)
   })
 
  const response = await User.deleteOne({ _id: new objectid(id) });
  console.log(response);
  res.send(response);
});

router.put("/update/:id", upload.single("updatedPhoto"), async (req, res) => {
  const id = req.params.id;

  if (req.body.updatedMsg !== "" && req.body.updatedPhoto !== ""){
    const url = req.protocol + "://" + req.get("host");
    const msg = req.body.updatedMsg;
    const photo = url + "/public/" + req.file.filename;

   
   const file=await User.find({_id:new objectid(id)});
   const fileDelete="./public/"+(file[0].Photo).toString().slice(29);
   fs.unlink(fileDelete,(err)=>{
     if(err){console.log(err)}
     console.log(`${fileDelete} was deleted`)
   })
 

    const response = await User.updateOne(
      { _id: new objectid(id) },
      { $set: { Photo: photo, msg: msg } }
    );
    res.send(response);
  } else if (req.body.updatedMsg === "") {
    const url = req.protocol + "://" + req.get("host");
    const photo = url + "/public/" + req.file.filename;

    const response = await User.updateOne(
      { _id: new objectid(id) },
      { $set: { Photo: photo } }
    );
    res.send(response);
  } else if (req.body.updatedPhoto === "") {
    const msg = req.body.updatedMsg;
    const response = await User.updateOne(
      { _id: new objectid(id) },
      { $set: { msg: msg } }
    );
    res.send(response);
  }
});

router.get("/", (req, res, next) => {
  User.find().then((data) => {
    res.status(200).json({
      users: data,
    });
  });
});
module.exports = router;
