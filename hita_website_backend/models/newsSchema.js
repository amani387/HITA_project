const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NewsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date:{
        type:String
    },
    urlToImage: {
        type: String
    },
    title:{
        type:String
    },
    content:{
        type:String
    }
}, {
    collection: 'news'
})

module.exports = mongoose.model('News', NewsSchema)