const mongoose = require('mongoose')
const Float = require('mongoose-float').loadType(mongoose);

const itemSchema = new mongoose.Schema({
    description   : { type: String, required: true, unique: true },
    cost          : {type: Float},
    quantity      : Number
});

const items = mongoose.model('items', itemSchema);

module.exports = items;
