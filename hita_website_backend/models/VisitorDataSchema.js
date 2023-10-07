const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 
const perMonth=new Schema(
  {  month:{
      type:Number,
    },
    count:{
      type:Number
    }},{
      _id:false
    }
);

const VisitorData = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    numberVisitor: {
      type: Number,
    },
    perPage: {
       home: {
        type: Number,
      },
      about: {
        type: Number,
      },
      service: {
        type: Number,
      },
      resource: {
        type: Number,
      },
      news: {
        type: Number,
      },
      vacancy: {
        type: Number,
      },
      contact: {
        type: Number,
      },
      blog: {
        type: Number,
      },
    },
    perMonth:{
      type:[perMonth]
      
    }
  },
  {
    collection: "numberOfVisitors",
  }
);

module.exports = mongoose.model("Visitor", VisitorData);
