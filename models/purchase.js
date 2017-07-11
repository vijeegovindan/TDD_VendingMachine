const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);

const purchaseSchema = new mongoose.Schema({
    description_id     : {type: mongoose.Schema.Types.ObjectId, ref:'items'},
    date               : {type: Date, default: Date.now},
    money_given        : {type: Float},
    change_received    : {type: Float}
})

const purchase = mongoose.model('purchase', purchaseSchema);

module.exports = purchase;
