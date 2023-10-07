const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchemaCarousel = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Date:{
      type:String
    },
    Photo: {
        type: String
    },
    msg:{
        type:String
    },
    content:{
        type:String
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchemaCarousel)