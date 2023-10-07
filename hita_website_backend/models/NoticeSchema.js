const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const NoticeSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Date:{
      type:String
    },
    name:{
        type:String
    },
    desc:{
        type:String
    },
    document:{
        type:String
    }
},
{
    collection:'Notice'
});

module.exports=mongoose.model("Notice",NoticeSchema);