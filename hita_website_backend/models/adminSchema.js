const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String
    },
    pwd:{
        type: String
    }
}, {
    collection: 'Admin'
})


module.exports=mongoose.model("Admin",AdminSchema)