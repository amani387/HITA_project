const mongoose = require("mongoose");
 
const Schema =  mongoose.Schema;

const BlogSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    date:{
        type:String
    },
    title:{
        type:String
    },
    content:{
        type:String
    },
    author:{
        type:String
    },
    
},{
    collection:'blog'
})

module.exports = mongoose.model('Blogs',BlogSchema);