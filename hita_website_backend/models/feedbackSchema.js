const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    senderEmail:{
        type:String
    },
    feedback:{
        type:String
    }
},{
    collection:'Feedback'
})

module.exports=mongoose.model("Feedback",FeedbackSchema);