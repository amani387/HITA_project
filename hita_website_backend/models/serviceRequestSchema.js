const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const ServiceRequestSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{
        type:String
    },
    services:{
        type:[String]
    },
    overview:{
        type:String
    },
    Status:{
        type:String
    }
},
{
    collection:'requestedServices'
});

module.exports=mongoose.model("ServiceRequest",ServiceRequestSchema);