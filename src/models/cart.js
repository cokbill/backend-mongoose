const mongoose = require('mongoose');

const Schema = mongoose.Schema

const cartSchema = new Schema({

    createdAt:{
        type: Date,
        require: false
    },
    updatedAt:{
        type: Date,
        require: false
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Cart', cartSchema);