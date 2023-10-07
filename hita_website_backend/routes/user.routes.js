let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  { v4: uuidv4 } = require("uuid"),
  nodeSchedule = require("node-schedule"),
  fs = require("fs");
objectid = require("objectid");
router = express.Router();
// User model
const axios = require("axios");
let Carousel = require("../models/model");
let Admin = require("../models/adminSchema");
const News = require("../models/newsSchema");
const subscribed = require("../models/subscriptionSchema");
const Blogs = require("../models/blogSchema");
const Vacancy = require("../models/vacancySchema");
const Feedback = require("../models/feedbackSchema");
const Notice = require("../models/NoticeSchema");
const Officer = require("../models/OfficerSchema");
const projects = require("../models/projectsSchema");
const Visitor = require("../models/VisitorDataSchema");
const ServiceRequest = require("../models/serviceRequestSchema");
const FormerDirector = require("../models/formerDirectorsSchema");
const Resource = require("../models/ResourceSchema");
const DirectorGeneralMessage = require("../models/directorGeneralMessageSchema");
const ServiceProvided = require("../models/ServiceProvided");
const cheerio = require("cheerio");
//for sending email to subscribers
// ("use strict");
const nodemailer = require("nodemailer");

const path = require("path");
const { scheduler } = require("timers/promises");
const { subscribe } = require("diagnostics_channel");
const OfficerSchema = require("../models/OfficerSchema");

const DIR = "./public/";

// let htmlContent = fs.readFileSync('./htmlTemplate.html');

//hita_website_backend\routes\htmlTemplate.html

let data = [];

const SendMails = async (NewsItem, html) => {
  const subs = [];
  const response = await subscribed.find();
  response.map((val) => {
    subs.push(val.email);
  });

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asebekalu@gmail.com",
      pass: "ghuarfvtrwysmhws",
    },
  });

  let detail = {
    from: "asebekalu@gmail.com",
    to: subs,
    subject: "Weekly News Letter",

    attachments: [
      {
        filename: NewsItem["urlToImage"],
        path: NewsItem["urlToImage"],
        cid: "newsCoverImage",
      },
    ],
    html: html,
  };

  mailTransporter.sendMail(detail, (err, info) => {
    if (err) {
      console.log("failed to send", err);
    } else {
      console.log("email sent successfull", info);
    }
  });
};

const SendNewsToSubs = async () => {
  await fetch(
    "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=32f3783c44af4309acaf48a289f599e9"
  )
    .then((response) => response.json())
    .then((val) => {
      data = val["articles"];
    })
    .catch((err) => console.log(err));

  const NewsItem = data[Math.floor(Math.random() * data.length)];

  let html = `
   <div style=" display: flex;
   margin-left:7rem;
   position: relative;
   text-align: center;
   align-items: center;
   justify-content: center;">
     <div class="container">
         <h2>Harari Regional State Innovation and Technology Agency</h2>
         <h3   style="text-align: center;">News Letter</h3>
         <div  style="  width: 50rem ;
         height: 30rem;">
             <img width="100%" height="100%" src="cid:newsCoverImage" alt="newcoverImage">
         </div>
        
             <p>${NewsItem["publishedAt"]}</p>
             <h1>${NewsItem["title"]}</h1>
       
         <div style="width:100%;">
             <p>${NewsItem["content"]}</p>
         </div>
         <div class="main-content">
             <p>${NewsItem["url"]}</p>
         </div>
         <div class="btn">
            <a href="http://localhost:3000/pages/news"> <button   style=" width: 10rem;
            height: 3rem;
            border-radius: 10rem;
            background-color: rgb(50, 170, 206);
            color: white;
            font-size: 1rem;">Load More</button></a>
         </div>
         <div><a href="http://localhost:3000/pages/unsubscribe">Unsubscribe</a>From news Letter</div>
     </div>
     </div>
 `;

  // console.log(NewsItem);
  SendMails(NewsItem, html);
};

const forNewSub = async (subscriberEmail) => {
  let html = `
   <div style=" display: flex;
   margin-left:7rem;
   position: relative;
   text-align: center;
   align-items: center;
   justify-content: center;">
     <div class="container">
         <h2>Harari Regional State Innovation and Technology Agency</h2>
         <h3   style="text-align: center;">News Letter</h3>
         <div  style="  width: 50rem ;
         height: 30rem;">
             <img width="100%" height="100%" src="cid:welcomeCoverImage" alt="newcoverImage">
         </div>
        
             <h1>Dear Subscriber Welcome to our newsletter</h1>
       
         <div style="width:100%;">
             <p>"Dear subscriber ,

             Welcome to our newsletter! We are thrilled to have you on board and cant wait to share our latest news and updates with you.
             
             Were dedicated to providing you with the best content and keeping you informed about local and global technology news. We hope youll find our newsletter informative, engaging, and valuable.
             
             Thank you for subscribing and joining our community. Were looking forward to staying in touch!
             
             Best !"</p>
             <strong>Hita</strong>
         </div>
         
         <div class="btn">
            <a href="http://localhost:3000/pages/news"> <button   style=" width: 10rem;
            height: 3rem;
            border-radius: 10rem;
            background-color: rgb(50, 170, 206);
            color: white;
            font-size: 1rem;">Go to News </button></a>
         </div>
         <div><a href="http://localhost:3000/pages/unsubscribe">Unsubscribe</a>From news Letter</div>
     </div>
     </div>
 `;

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asebekalu@gmail.com",
      pass: "ghuarfvtrwysmhws",
    },
  });

  let detail = {
    from: "asebekalu@gmail.com",
    to: subscriberEmail,
    subject: "Welcome message",

    attachments: [
      {
        filename: "public/3e009b71-8218-485b-acc0-a9d1e858330b-hint.jpg",
        path: "public/3e009b71-8218-485b-acc0-a9d1e858330b-hint.jpg",
        cid: "welcomeCoverImage",
      },
    ],
    html: html,
  };

  mailTransporter.sendMail(detail, (err, info) => {
    if (err) {
      console.log("failed to send", err);
    } else {
      console.log("email sent successfull", info);
    }
  });
};

const cdate = new Date();
// cdate.setSeconds(cdate.getSeconds() + 10);
// const jobs = nodeSchedule.scheduleJob(cdate, function () {
//
// });

const job = nodeSchedule.scheduleJob(
  { hour: 9, minute: 0, dayOfWeek: 1 },
  () => {
    // send mail with defined transport object
    SendNewsToSubs();
  }
);

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
const uploadResource = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|txt|pptx|docx|doc/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error("Error: Only pdf, txt, pptx, docx and doc files are allowed!")
      );
    }
  },
});
var uploadDoc = multer({
  storage: storage,
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const pwd = req.body.pwd;

  const response = await Admin.find({ username, pwd });

  if (response.length === 0) res.json({ status: "notfound" });
  else res.json({ status: "found", logedAdmin: response[0]["_id"] });
});
function sendPwdR(email, msg) {
  let html = `
 <div style=" display: flex;
 margin-left:4rem;
 position: relative;
 text-align: center;
 align-items: center;
 justify-content: center;">
   <div class="container">
       <h2>Harari Regional State Innovation and Technology Agency</h2>
         ${msg}
   </div>
   </div>
`;

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asebekalu@gmail.com",
      pass: "ghuarfvtrwysmhws",
    },
  });

  let detail = {
    from: "asebekalu@gmail.com",
    to: email,
    subject: "Confidential",
    html: html,
  };

  mailTransporter.sendMail(detail, (err, info) => {
    if (err) {
      console.log("failed to send", err);
    } else {
      console.log("email sent successfull", info);
    }
  });
}
router.post("/resetPassword", async (req, res) => {
  const username = req.body.fadminUserName;
  const response = await Admin.find({ username: username });
  const dir = await Officer.find({ Role: "Director General" });

  console.log(response);

  const uname = response[0]["username"] || "";
  const pwd = response[0]["pwd"] || "";

  console.log(uname, pwd);

  let msgToDir = `<div style="width:100%;">
           <p>"Dear Director ,

           According to The system admins request for admin login password reset  ,<br> we sent you full information about the admin login;
           </p>
           <p>username : ${uname}</p>
           <p>password : ${pwd}</p>
           <strong>Hita</strong>
       </div>`;
  let msgToAdmin = `<div style="width:100%;">
<p>"Dear Admin ,

According to your request for admin login password reset  ,<br> we have sent full information about the admin login to Director General ;
</p>
<p>Please Contact The General Director</p>
<strong>Hita</strong>
</div>`;

  // console.log(dir[0]["Email"]);
  // console.log(req.params.email);

  sendPwdR(dir[0]["Email"], msgToDir);
  sendPwdR(req.body.femail, msgToAdmin);

  res.send("successfull");
});

router.post("/add-carousel", upload.single("profileImg"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const user = new Carousel({
    _id: new mongoose.Types.ObjectId(),
    Date: req.body.date,
    Photo: url + "/public/" + req.file.filename,
    msg: req.body.msg,
    content: req.body.content,
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
  // console.log(req.params.id);
  const id = req.params.id;

  const file = await Carousel.find({ _id: new objectid(id) });
  const fileDelete = "./public/" + file[0].Photo.toString().slice(29);
  fs.unlink(fileDelete, (err) => {
    if (err) {
      console.log(err);
    }
    // console.log(`${fileDelete} was deleted`);
  });

  const response = await Carousel.deleteOne({ _id: new objectid(id) });
  // console.log(response);
  res.send(response);
});

router.put("/update/:id", upload.single("updatedPhoto"), async (req, res) => {
  const id = req.params.id;

  //TODO : complete error catching

  // let data = {};

  // if (req.file) {
  //   const url = req.protocol + "://" + req.get("host");
  //   noticeDoc = url + "/public/" + req.file.filename;

  //   data = {
  //     name: name,
  //     desc: desc,
  //     document: noticeDoc,
  //   };
  // } else {
  //   data = {
  //     name: name,
  //     desc: desc,
  //   };
  // }

  const url = req.protocol + "://" + req.get("host");
  const msg = req.body.updatedMsg;
  const content = req.body.updatedContent;
  const photo = url + "/public/" + req.file.filename;

  const file = await Carousel.find({ _id: new objectid(id) });
  const fileDelete = "./public/" + file[0].Photo.toString().slice(29);
  fs.unlink(fileDelete, (err) => {
    if (err) {
      console.log(err);
    }
    // console.log(`${fileDelete} was deleted`);
  });

  const response = await Carousel.updateOne(
    { _id: new objectid(id) },
    { $set: { Photo: photo, msg: msg, content: content } }
  );
  res.send(response);
});

router.post("/post-news", upload.single("image"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const photo = url + "/public/" + req.file.filename;
  const header = req.body.header;
  const content = req.body.content;
  const date = req.body.Date;

  const NewsContent = new News({
    _id: new mongoose.Types.ObjectId(),
    date: date,
    title: header,
    content: content,
    urlToImage: photo,
  });

  await NewsContent.save()
    .then((result) => {
      res.send(`Successfull ${result}`);
    })
    .catch((err) => {
      res.send(` Failed To Post ${err}`);
    });
});

router.delete("/delete-news/:id", async (req, res) => {
  const id = req.params.id;
  const resp = await News.deleteOne({ _id: new objectid(id) })
    .then(() => res.send("successfully deleted"))
    .catch((err) => res.send("failed to delete" + err));
  // console.log(resp);
});

router.put(
  "/update-news/:id",
  upload.single("updatedPhoto"),
  async (req, res) => {
    const id = req.params.id;

    if (
      req.body.updatedTitle !== "" &&
      req.body.updatedPhoto !== "" &&
      req.body.updatedContent
    ) {
      const url = req.protocol + "://" + req.get("host");
      const title = req.body.updatedTitle;
      const updatedContent = req.body.updatedContent;
      const photo = url + "/public/" + req.file.filename;

      const file = await News.find({ _id: new objectid(id) });
      const fileDelete = "./public/" + file[0].urlToImage.toString().slice(29);
      fs.unlink(fileDelete, (err) => {
        if (err) {
          console.log(err);
        }
        // console.log(`${fileDelete} was deleted`);
      });

      const response = await News.updateOne(
        { _id: new objectid(id) },
        { $set: { urlToImage: photo, title: title, content: updatedContent } }
      );
      res.send(response);
    } else if (req.body.updatedTitle === "") {
      const url = req.protocol + "://" + req.get("host");
      const photo = url + "/public/" + req.file.filename;

      const response = await News.updateOne(
        { _id: new objectid(id) },
        { $set: { urlToImage: photo, content: updatedContent } }
      );
      res.send(response);
    } else if (req.body.updatedPhoto === "") {
      const upTitle = req.body.updatedTitle;
      const response = await News.updateOne(
        { _id: new objectid(id) },
        { $set: { title: upTitle, content: updatedContent } }
      );
      res.send(response);
    } else if (req.body.updatedContent === "") {
      const url = req.protocol + "://" + req.get("host");
      const photo = url + "/public/" + req.file.filename;
      const upTitle = req.body.updatedTitle;

      const file = await News.find({ _id: new objectid(id) });
      const fileDelete = "./public/" + file[0].urlToImage.toString().slice(29);
      fs.unlink(fileDelete, (err) => {
        if (err) {
          console.log(err);
        }
        // console.log(`${fileDelete} was deleted`);
      });

      const response = await News.updateOne(
        { _id: new objectid(id) },
        { $set: { urlToImage: photo, title: upTitle } }
      );
      res.send(response);
    }
  }
);

router.get("/get-global-News", async (req, res) => {
  await axios
    .get(
      "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=32f3783c44af4309acaf48a289f599e9"
    )
    .then((data) => {
      res.send(data.data.articles);
    })
    .catch((err) => res.send(err));
});

router.get("/get-techNews-local", async (req, res) => {
  const url = "https://www.fanabc.com/archives/category/tech";
  await axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const articles = [];
      $("article").each((i, e) => {
        const title = $(e).find("h2").text();
        const link = $(e).find("a").attr("href");

        const imageUrl = $(e).find(".img-holder").attr("data-src");
        const imageUrl2 = $(e).find(".img-cont").attr("data-src");
        const desc = $(e).find("div.post-summary").text();
        const image = imageUrl ? imageUrl : imageUrl2;
        articles.push({ title, link, image, desc });
      });
      res.send(articles);
      // console.log(articles);
    })
    .catch((err) => console.log(err));
});

router.get("/getNews", async (req, res) => {
  await News.find()
    .then((data) => {
      res.json(data);
      // console.log(data);
    })
    .catch((err) => res.send(err));
});

router.get("/", (req, res, next) => {
  Carousel.find().then((data) => {
    res.status(200).json({
      users: data,
    });
  });
});

async function isSubscribed(semail) {
  const checkEmail = await subscribed.findOne({ email: semail });
  return checkEmail !== null;
}

router.post("/subscribe", async (req, res) => {
  const subscriberEmail = req.body.email;
  if (await isSubscribed(subscriberEmail)) {
    res.send("Already subscribed !");
  } else {
    const subscriber = new subscribed({
      _id: new mongoose.Types.ObjectId(),
      email: subscriberEmail,
    });
    const response = await subscriber
      .save()
      .then((result) => {
        res.send("Subscription Successfull");
        forNewSub(subscriberEmail);
      })
      .catch((err) => res.send("Sorry ! Subscription Failed !"));
  }
});

router.delete("/unsubscribe/:Unsubemail", async (req, res) => {
  const email = req.params.Unsubemail;

  // console.log(email);

  await subscribed
    .findOneAndDelete({ email: email })
    .then((val) => res.send("successfull"))
    .catch((err) => res.send(err));
});

router.post("/publish-blog", async (req, res) => {
  const title = req.body.header;
  const content = req.body.content;
  const author = req.body.author;
  const date = req.body.Date;
  // console.log(date, content);
  const BlogsContent = new Blogs({
    _id: new mongoose.Types.ObjectId(),
    date: date,
    title: title,
    content: content,
    author: author,
  });

  //tobe continued

  const response = await BlogsContent.save()
    .then(() => console.log("saved"))
    .catch((err) => console.log("Blog Post failed", err));
  res.send(response);
});

router.get("/get-blogs", async (req, res) => {
  Blogs.find()
    .then((val) => res.send(val))
    .catch((err) => res.send(err));
});

router.delete("/delete-blogs/:id", async (req, res) => {
  const id = req.params.id;
  await Blogs.findByIdAndDelete({ _id: objectid(id) })
    .then((val) => res.send("successfull"))
    .catch((err) => res.send("Failed"));
});
router.put("/update-blogs/:id", async (req, res) => {
  console.log(req.params.id, req.body);
  const { updatedTitle, updatedContent, author } = req.body;
  const id = req.params.id;

  await Blogs.updateOne(
    { _id: objectid(id) },
    {
      $set: {
        title: updatedTitle,
        content: updatedContent,
        author: author,
      },
    }
  )
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});

router.post("/post-vacancy", async (req, res) => {
  const data = [];

  const position = req.body.position;
  const responsibility = req.body.responsibility;

  responsibility.forEach((element) => {
    data.push(element);
  });

  const Date = req.body.Date;
  const sallary = req.body.sallary;
  const location = req.body.location;
  const jobOverView = req.body.jobOverView;
  const qualification = req.body.qualification;
  const department = req.body.department;
  const linkToApply = req.body.linkToApply;

  const JobsData = new Vacancy({
    _id: new mongoose.Types.ObjectId(),
    date: Date,
    dep: department,
    position: position,
    sallary: sallary,
    location: location,
    overview: jobOverView,
    responsibilities: responsibility,
    qualificationSkills: qualification,
    linkToApply: linkToApply,
  });

  await JobsData.save()
    .then((resp) => {
      res.send(resp);
      // console.log(resp);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
});

router.put("/update-vacancy/:id", async (req, res) => {
  const data = [];
  const id = req.params.id;

  const position = req.body.position;
  const responsibility = req.body.responsibility;

  responsibility.forEach((element) => {
    data.push(element);
  });

  const sallary = req.body.sallary;
  const location = req.body.location;
  const jobOverView = req.body.jobOverView;
  const qualification = req.body.qualification;
  const department = req.body.department;
  const linkToApply = req.body.linkToApply;

  await Vacancy.updateOne(
    { _id: new objectid(id) },
    {
      $set: {
        dep: department,
        position: position,
        sallary: sallary,
        location: location,
        overview: jobOverView,
        responsibilities: responsibility,
        qualificationSkills: qualification,
        linkToApply: linkToApply,
      },
    }
  )
    .then((resp) => {
      res.send(resp);
      // console.log(resp);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
});

router.get("/get-jobs", async (req, res) => {
  await Vacancy.find()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
router.delete("/delete-jobs/:id", async (req, res) => {
  const id = req.params.id;

  await Vacancy.deleteOne({ _id: new objectid(id) })
    .then((val) => res.send(val))
    .catch((err) => {
      console.log(err);
      alert("Deletion Failed");
    });
});

router.post("/send-feedback", async (req, res) => {
  const { senderEmail, feedback } = req.body;

  const FeedbackData = new Feedback({
    _id: new mongoose.Types.ObjectId(),
    senderEmail: senderEmail,
    feedback: feedback,
  });

  await FeedbackData.save()
    .then((response) => res.send(response))
    .catch((err) => console.log(err));
});

router.get("/get-feedback", async (req, res) => {
  await Feedback.find()
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});
router.delete("/delete_all_feedback", async (req, res) => {
  await Feedback.deleteMany({})
    .then((val) => res.send(val))
    .catch((err) => res.send(err));
});
router.delete("/delete_single_feedback/:id", async (req, res) => {
  const id = req.params.id;
  await Feedback.deleteOne({ _id: new objectid(id) })
    .then((val) => res.send(val))
    .catch((err) => res.send(err));
});

router.post("/post_projects", upload.array("image"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  const { title, desc, category } = req.body;

  let photoData = [];

  for (let i = 0; i < req.files.length; i++) {
    const photo = url + "/public/" + req.files[i].filename;
    photoData.push(photo);
  }

  const projectData = new projects({
    _id: new mongoose.Types.ObjectId(),
    title: title,
    desc: desc,
    photo: photoData,
    category: category,
  });
  await projectData
    .save()
    .then((val) => {
      res.send(val);
    })
    .catch((err) => res.send(err));
});

router.get("/get_projects", async (req, res) => {
  await projects
    .find({})
    .then((val) => res.send(val))
    .catch((err) => res.send(err));
});

router.delete("/delete-project/:id", async (req, res) => {
  const id = req.params.id;

  await projects
    .deleteOne({ _id: new objectid(id) })
    .then((val) => res.send("Successfully delelted"))
    .catch((err) => res.send(err));
});
router.put("/update_project/:id", upload.single("photo"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const photo = url + "/public/" + req.file.filename;
  const id = req.params.id;
  const { title, desc } = req.body;

  await projects
    .updateOne(
      { _id: new objectid(id) },
      {
        $set: {
          title: title,
          desc: desc,
          photo: photo,
        },
      }
    )
    .then((val) => res.send("updating successfull"))
    .catch((err) => res.send(err));
});

router.post("/add-subAdmin", async (req, res) => {
  const { name, password, authority } = req.body;

  // ["Posting", "Editing", "Deleting"];

  console.log(authority);
  const newAuth = {
    Posting: authority.includes("Posting"),
    Editing: authority.includes("Editing"),
    Deleting: authority.includes("Deleting"),
  };

  const subAdmin = new Admin({
    _id: new mongoose.Types.ObjectId(),
    username: name,
    pwd: password,
    role: "subAdmin",
    // authority: newAuth,
  });

  // console.log(
  //   authority.includes("Posting"),
  //   authority.includes("Editing"),
  //   authority.includes("Deleting")
  // );

  await subAdmin
    .save()
    .then((val) => res.send(val))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/get-admin", async (req, res) => {
  await Admin.find()
    .then((val) => {
      res.send(val);
      console.log(val);
    })
    .catch((err) => console.log(err));
});
router.get("/get-loggedIn-admin/:id", async (req, res) => {
  const id = req.params.id;
  await Admin.findOne({ _id: new objectid(id) })
    .then((val) => {
      res.send(val);
      console.log(val);
    })
    .catch((err) => console.log(err));
});
router.put(
  "/update-admin/:id",
  upload.single("profileImage"),
  async (req, res) => {
    const id = req.params.id;
    const { uname, role, authority } = req.body;
    const url = req.protocol + "://" + req.get("host");
    const Photo = url + "/public/" + req.file.filename;

    const newAuth = {
      Posting: authority.includes("Posting"),
      Editing: authority.includes("Editing"),
      Deleting: authority.includes("Deleting"),
    };

    await Admin.updateOne(
      { _id: new objectid(id) },
      {
        $set: {
          username: uname,
          profileImage: Photo,
          authority: newAuth,
          role: role,
        },
      }
    )
      .then((val) => res.send("Successfully Updated"))
      .catch((err) => console.log(err));
  }
);
router.delete("/delete-admin/:id", async (req, res) => {
  const id = req.params.id;

  await Admin.deleteOne({ _id: new objectid(id) })
    .then((val) => res.send("Successfully Deleted ! "))
    .catch((err) => console.log(err));
});

router.put("/change-pwd/:id", async (req, res) => {
  const pwdNew = req.body.newP.toString();
  const old = req.body.old;
  const id = req.params.id;

  await Admin.find({ _id: new objectid(id) })
    .then((val) => {
      if (old !== val[0]["pwd"]) {
        res.send("Please Enter The correct Previous Password");
      } else {
        Admin.updateOne({ pwd: req.body.old }, { $set: { pwd: pwdNew } })
          .then((value) => {
            res.send("Password Successfully Changed");
            // console.log(value);
          })
          .catch((err) => res.send(err));
      }
      // console.log(val);
    })
    .catch((err) => console.log(err));
});

router.put(
  "/change-profile-image/:id",
  upload.single("profileImage"),
  async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const Photo = url + "/public/" + req.file.filename;
    const id = req.params.id;
    await Admin.updateOne(
      { _id: new objectid(id) },
      { $set: { profileImage: Photo } }
    )
      .then((val) => {
        res.send(val);
        console.log(val);
      })
      .catch((err) => res.send(err));
  }
);
router.post("/postNotice", uploadDoc.single("file"), async (req, res) => {
  let noticeDoc;
  const name = req.body.name;
  const desc = req.body.notice;
  const Date = req.body.date;
  let data = {};

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    noticeDoc = url + "/public/" + req.file.filename;

    data = {
      name: name,
      Date: Date,
      desc: desc,
      document: noticeDoc,
    };
  } else {
    data = {
      Date: Date,
      name: name,
      desc: desc,
    };
  }

  const NoticeData = new Notice({
    _id: new mongoose.Types.ObjectId(),
    ...data,
  });

  await NoticeData.save()
    .then((val) => {
      res.send("successfull");
      // console.log(val);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
});

router.get("/get-notice", async (req, res) => {
  await Notice.find({})
    .then((val) => {
      res.send(val);
      // console.log(val);
    })
    .catch((err) => res.send(err));
});
router.delete("/delete-notice/:id", async (req, res) => {
  const id = req.params.id;
  await Notice.deleteOne({ _id: new objectid(id) })
    .then((val) => res.send("Successfully removed"))
    .catch((err) => res.send(err));
});

router.put("/updateNotice/:id", uploadDoc.single("file"), async (req, res) => {
  let noticeDoc;
  const id = req.params.id;
  const name = req.body.name;
  const desc = req.body.notice;
  const Date = req.body.date;
  let data = {};

  console.log(req.params.id, req.body);

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    noticeDoc = url + "/public/" + req.file.filename;

    data = {
      name: name,
      Date: Date,
      desc: desc,
      document: noticeDoc,
    };
  } else {
    data = {
      Date: Date,
      name: name,
      desc: desc,
    };
  }

  await Notice.updateOne({ _id: new objectid(id) }, { $set: data })
    .then((val) => {
      res.send("successfull");
      console.log(val);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
});

router.get("/get-officers", async (req, res) => {
  await Officer.find({})
    .then((val) => res.send(val))
    .catch((err) => res.send(err));
});

router.put("/updateOfficers/:id", upload.single("photo"), async (req, res) => {
  const { officerName, photo, email, EarlyLife, Carer, personalLife } =
    req.body;
  const id = req.params.id;

  let data = {};

  // console.log("id is :", new objectid(id));

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    OfficerPhoto = url + "/public/" + req.file.filename;

    data = {
      officerName: officerName,
      // Role: role,
      Email: email,
      Photo: OfficerPhoto,
      EarlyLifeAndEducation: EarlyLife,
      Carer: Carer,
      PersonalLife: personalLife,
    };
  } else {
    data = {
      officerName: officerName,
      // Role: role,
      Email: email,
      EarlyLifeAndEducation: EarlyLife,
      Carer: Carer,
      PersonalLife: personalLife,
    };
  }

  //   await Officers.updateOne({ _id: new objectid(id) }, { $set: { ...data } })
  //     .then((val) => {res.send(val);console.log(val)})
  //     .catch((err) => res.send(err));

  await Officer.updateOne({ _id: new objectid(id) }, { $set: { ...data } })
    .then((val) => {
      res.send("successfull");
      // console.log(val);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
  //   await Officer.findOne({ _id: id })
  //     .then((val) => console.log(val))
  //     .catch((err) => console.log(err));
});

router.get("/numVisitor", async (req, res) => {
  let subscriberNum, VisitorNum, perPageV, perMonthV;

  await Visitor.find({})
    .then((val) => {
      perPageV = val[0]["perPage"];
      VisitorNum = val[0]["numberVisitor"];
      perMonthV = val[0]["perMonth"];
      // console.log(val)
      // console.log(perMonthV)
    })
    .catch((err) => console.log(err));
  await subscribed
    .find({})
    .then((val) => {
      subscriberNum = val;
    })
    .catch((err) => console.log(err));

  res.json({
    nSub: subscriberNum,
    nVisitor: VisitorNum,
    nPerpage: perPageV,
    nPermonth: perMonthV,
  });
});

router.post("/updateNumVisitor/:id", async (req, res) => {
  const b = req.params.id;

  const a = await Visitor.findOne({}, { perPage: 1, numberVisitor: 1 });

  // console.log(req.params.id);

  const perPageVisitor = a.perPage[b] + 1;
  const nuVisitor = a.numberVisitor + 1;

  const monthNow = new Date().getMonth() + 1;
  const existingVisitor = await Visitor.findOne({ "perMonth.month": monthNow });

  if (existingVisitor) {
    await Visitor.findOneAndUpdate(
      { "perMonth.month": monthNow },
      { $inc: { "perMonth.$.count": 1 } },
      { new: true }
    )
      .then((val) => {
        console.log(
          `Updated visitor count for month ${monthNow}: ${
            val.perMonth.find((obj) => obj.month === monthNow).count
          }`
        );
      })
      .catch((err) => console.log(err));
  } else {
    await Visitor.findOneAndUpdate(
      {},
      { $push: { perMonth: { month: monthNow, count: 1 } } },
      { new: true, upsert: true }
    )
      .then((val) => {
        console.log(`Created new visitor count for month ${monthNow}: 1`);
      })
      .catch((err) => console.log(err));
  }

  await Visitor.updateMany(
    {},
    {
      $set: { numberVisitor: nuVisitor, [`perPage.${b}`]: perPageVisitor },
    }
  )
    .then((val) => {
      // console.log(val);
      res.send(val);
    })
    .catch((err) => console.log(err));
});

router.post("/service-request", async (req, res) => {
  console.log(req.body.serviceSelected);
  console.log(req.body.email);

  const uEmail = req.body.email;
  const reqService = req.body.serviceSelected;
  const serOverview = req.body.overview;

  const serviceRequestData = new ServiceRequest({
    _id: new mongoose.Types.ObjectId(),
    email: uEmail,
    services: reqService,
    overview: serOverview,
  });

  await serviceRequestData
    .save()
    .then((val) => console.log(val))
    .catch((err) => console.log(err));
});

router.get("/get-service-request", async (req, res) => {
  await ServiceRequest.find({})
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});
router.delete("/delete-service-request/:id", async (req, res) => {
  const id = req.params.id;
  await ServiceRequest.deleteOne({ _id: objectid(id) })
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});

router.post("/forward-to-directors", async (req, res) => {
  console.log(req.body);
  const body = req.body;

  const email = body.roles;
  const emails = [];
  const reqId = body["req"]["_id"];

  email.map((val) => {
    emails.push(val["Email"]);
  });
  const overview = body.req["overview"];
  const services = body.req["services"];

  console.log(emails, overview, services);

  console.log("request id :", body["req"]["_id"]);

  let html = `
   <div style=" display: flex;
   margin-left:1rem;
   position: relative;
   text-align: center;
   align-items: center;
   justify-content: center;">
     <div class="container">
         <h2>Harari Regional State Innovation and Technology Agency</h2>
         <h3   style="text-align: center;">Service Request Letter</h3>
 
             <h2>For whom it may concern</h2>
       
         <div style="width:100%;">
             <p>"Director there is service request with the following information attached"</p>
             <br/>
               <p> <strong>Overview </strong> : <br/>${overview}  </p>
         
             <h3>Requested Service lists</h3>
             <ul>
             
              ${services
                .map(
                  (item) => `
              <li>
                <td>${item}</td>
                
              </li>`
                )
                .join("")}
             </ul>
             <p>please ,give us response on services corresponding your Directorate</p>
             <a href='http://localhost:5000/api/reject-request/${reqId}' onclick="location.reload();"> <button>Reject</button></a>
             <a href='http://localhost:5000/api/approve-request/${reqId}' onclick="location.reload();"> <button>Approve</button></a>
             <br/>
             <strong>Admin</strong>
         </div>
         
          
     </div>
     </div>
 `;

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asebekalu@gmail.com",
      pass: "ghuarfvtrwysmhws",
    },
  });

  let detail = {
    from: "asebekalu@gmail.com",
    to: emails,
    subject: "Service Request Letter",
    html: html,
  };

  mailTransporter.sendMail(detail, (err, info) => {
    if (err) {
      console.log("failed to send", err);
    } else {
      console.log("email sent successfull", info);

      ServiceRequest.updateOne(
        { _id: objectid(reqId) },
        { $set: { Status: "Pending" } }
      )
        .then((val) => console.log(val))
        .catch((err) => console.log(err));
    }
  });

  res.send("arrived");
});
router.post("/replay-to-requester", async (req, res) => {
  const { email, msg } = req.body;

  let html = `
   <div style=" display: flex;
   margin-left:1rem;
   position: relative;
   text-align: center;
   align-items: center;
   justify-content: center;">
     <div class="container">
         <h2>Harari Regional State Innovation and Technology Agency</h2>
         <h3   style="text-align: center;">Service Request Letter</h3>
 
             <h2>Response On Your Request For Our Service</h2>
       
         <div style="width:100%;">
             <p>"Dear User ,"</p>
             <br/>
               <p>  >${msg}  </p>

             <strong>Admin</strong>
         </div>
     </div>
     </div>
 `;

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asebekalu@gmail.com",
      pass: "ghuarfvtrwysmhws",
    },
  });

  let detail = {
    from: "asebekalu@gmail.com",
    to: email,
    subject: "Reply For Service Request",
    html: html,
  };

  mailTransporter.sendMail(detail, (err, info) => {
    if (err) {
      res.send("failed to send ");
    } else {
      res.send("email sent successfull ");
    }
  });
});

router.get("/reject-request/:id", async (req, res) => {
  console.log("from email");
  console.log("rejected service Id", req.params.id);

  const rejId = req.params.id;

  ServiceRequest.updateOne(
    { _id: objectid(rejId) },
    { $set: { Status: "Rejected" } }
  )
    .then((val) => console.log(val))
    .catch((err) => console.log(err));

  res.send("<h2>Service Request Rejected</h2>");
});
router.get("/approve-request/:id", async (req, res) => {
  console.log("from email");
  console.log("Approved service Id", req.params.id);

  const rejId = req.params.id;

  ServiceRequest.updateOne(
    { _id: objectid(rejId) },
    { $set: { Status: "Approved" } }
  )
    .then((val) => console.log(val))
    .catch((err) => console.log(err));

  res.send("<h2>Service Request Approved</h2>");
});

router.post(
  "/uploadResource",
  uploadResource.single("file"),
  async (req, res) => {
    const { title, detail } = req.body;

    const url = req.protocol + "://" + req.get("host");
    const file = url + "/public/" + req.file.filename;

    const ResouceData = new Resource({
      _id: new mongoose.Types.ObjectId(),
      title: title,
      detail: detail,
      file: file,
    });

    await ResouceData.save()
      .then((val) => {
        res.send(val);
        console.log(val);
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  }
);

router.get("/getResouces", async (req, res) => {
  await Resource.find({})
    .then((val) => {
      console.log(val);
      res.send(val);
    })
    .catch((err) => console.log(err));
});

router.put(
  "/updateResource/:id",
  uploadResource.single("file"),
  async (req, res) => {
    const id = req.params.id;

    const { title, detail } = req.body;
    const url = req.protocol + "://" + req.get("host");
    const file = url + "/public/" + req.file.filename;

    await Resource.updateOne(
      { _id: new objectid(id) },
      {
        $set: {
          title: title,
          detail: detail,
          file: file,
        },
      }
    )
      .then((val) => console.log(val))
      .catch((err) => console.log(err));
  }
);

router.delete("/delete-resource/:id", async (req, res) => {
  const id = req.params.id;
  await Resource.deleteOne({ _id: new objectid(id) })
    .then((val) => {
      console.log(val);
      res.send("Successfully Deleted");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});
router.post(
  "/add-FormerDirector",
  upload.single("DirectorImage"),
  async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const Photo = url + "/public/" + req.file.filename;

    const { name, Description, duration } = req.body;
    const date = JSON.parse(req.body.duration);

    console.log(date["startDate"], "to", date["endDate"], name, Description);

    const FormerDirectorData = new FormerDirector({
      _id: new mongoose.Types.ObjectId(),
      DirectorName: name,
      Descrption: Description,
      DirectorPhoto: Photo,
      Duration: {
        from: date["startDate"],
        to: date["endDate"],
      },
    });

    await FormerDirectorData.save()
      .then((val) => res.send(val))
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get("/get-FormerDirectors", async (req, res) => {
  await FormerDirector.find({})
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});
router.delete("/delete-FormerDirector/:id", async (req, res) => {
  const id = req.params.id;
  await FormerDirector.deleteOne({ _id: new objectid(id) })
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});
router.put(
  "/update-FormerDirectors/:id",
  upload.single("FormerDirectorImage"),

  async (req, res) => {
    const id = req.params.id;
    const { name, Descritpion, duration } = req.body;
    const date = JSON.parse(duration);

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      const Photo = url + "/public/" + req.file.filename;

      await FormerDirector.updateOne(
        { _id: new objectid(id) },
        {
          $set: {
            DirectorName: name,
            DirectorPhoto: Photo,
            Descrption: Descritpion,
            Duration: {
              from: date["startDate"],
              to: date["endDate"],
            },
          },
        }
      )
        .then((val) => res.send(val))
        .catch((err) => console.log(err));
    } else {
      await FormerDirector.updateOne(
        { _id: new objectid(id) },
        {
          $set: {
            DirectorName: name,

            Descrption: Descritpion,
            Duration: {
              from: date["startDate"],
              to: date["endDate"],
            },
          },
        }
      )
        .then((val) => res.send(val))
        .catch((err) => console.log(err));
    }
  }
);
router.get("/getDirectorGeneralsMessage", async (req, res) => {
  DirectorGeneralMessage.find({})
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});
router.put(
  "/updateDirectorGeneralsMessage",
  upload.single("DirectorImage"),
  async (req, res) => {
    const { name, Message } = req.body;

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      const Photo = url + "/public/" + req.file.filename;

      await DirectorGeneralMessage.updateOne(
        {},
        {
          $set: {
            DirectorName: name,
            DirectorPhoto: Photo,
            DirectorMessage: Message,
          },
        }
      )
        .then((val) => res.send(val))
        .catch((err) => console.log(err));
    } else {
      await DirectorGeneralMessage.updateOne(
        {},
        {
          $set: {
            DirectorName: name,

            DirectorMessage: Message,
          },
        }
      )
        .then((val) => res.send(val))
        .catch((err) => console.log(err));
    }
  }
);
router.post("/addService", upload.single("file"), async (req, res) => {
  const { title, overview, detail, file } = req.body;
  const url = req.protocol + "://" + req.get("host");
  const Photo = url + "/public/" + req.file.filename;

  const ServiceData = new ServiceProvided({
    _id: new mongoose.Types.ObjectId(),
    icon: Photo,
    title: title,
    detail: detail,
    overView: overview,
  });
  await ServiceData.save()
    .then((val) => {
      res.send(val);
      console.log(val);
    })
    .catch((err) => console.log(err));
});
router.get("/getService", async (req, res) => {
  await ServiceProvided.find({})
    .then((val) => res.send(val))
    .catch((err) => console.log(err));
});
router.delete("/delete-service/:id", async (req, res) => {
  const id = req.params.id;
  await ServiceProvided.deleteOne({ _id: new objectid(id) })
    .then((val) => {
      res.send(val);
      console.log(val);
    })
    .catch((err) => console.log(err));
});
router.put("/updateService/:id", upload.single("file"), async (req, res) => {
  const { title, overView, detail } = req.body;
  const id = req.params.id;
  const url = req.protocol + "://" + req.get("host");
  const icon = url + "/public/" + req.file.filename;

  await ServiceProvided.updateOne(
    { _id: new objectid(id) },
    {
      $set: {
        icon: icon,
        title: title,
        detail: detail,
        overView: overView,
      },
    }
  )
    .then((val) => {
      res.send(val);
      console.log(val);
    })
    .catch((err) => console.log(err));
});
module.exports = router;
