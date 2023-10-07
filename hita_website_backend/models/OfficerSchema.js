const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const OfficerSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    officerName:{
      type:String
    },
    Role:{
        type:String
    },
    Email:{
        type:String
    },
    Photo:{
        type:String
    },
    EarlyLifeAndEducation:{
        type:String
    },
    Carer:{
        type:String
    },
    PersonalLife:{
        type:String
    }
},
{
    collection:'Officers'
});

module.exports=mongoose.model("Officer",OfficerSchema);