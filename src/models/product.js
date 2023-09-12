const mongoose = require('mongoose');

const Schema = mongoose.Schema

const productSchema = new Schema({
    title:{
        type: String,
        require: false
    },
    price:{
        type: Number,
        require: true
    },
    description:{
        type: String,
        require: false
    },
    imageUrl:{
        type: String,
        require: false
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);