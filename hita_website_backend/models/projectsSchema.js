const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const projectsSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{
        type:String
    },
    category:{
      type:String
    },
    desc:{
        type:String
    },
    photo:{
        type:[String]
    }

},
{
    collection:'projects'
});

module.exports=mongoose.model("Projects",projectsSchema);