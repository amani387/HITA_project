const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchemaCarousel = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Photo: {
        type: String
    },
    msg:{
        type:String
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchemaCarousel)