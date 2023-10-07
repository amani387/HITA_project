const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
 
    email:{
        type:String
    }
}, {
    collection: 'subscribed'
})

module.exports = mongoose.model('subscribed', SubscriptionSchema)