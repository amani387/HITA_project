const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const resp=new Schema({

  responsibility:{
    type:String
  }
},{
  _id:false
})
const qual=new Schema({

  qualification:{
    type:String
  }
},{
  _id:false
})

const VacancySchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    date:{
      type:String,
    },
    dep: {
      type: String,
    },
    position: {
      type: String,
    },
    sallary: {
      type: String,
    },
    location: {
      type: String,
    },
    overview: {
      type: String,
    },
    responsibilities: {
      type: [resp],
    },
    qualificationSkills: {
      type: [qual],
    },
    linkToApply:{
      type:String
    }
  },
  {
    collection: "Vacancy",
  }
);

module.exports = mongoose.model("Vacancy", VacancySchema);
