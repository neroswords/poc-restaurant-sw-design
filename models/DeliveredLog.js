const mongoose = require('mongoose');

const DeliveredLogSchema=new mongoose.Schema({
    menu:{
        type : mongoose.Schema.ObjectId,
        ref : 'Menu',
        required : true
    },
    plate : {
        type : mongoose.Schema.ObjectId,
        ref : 'Plate',
        required : true
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    status : {
        type:String,
        enum: ['on_going','delivered'],
        default: 'on_going'
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('DeliveredLog',DeliveredLogSchema);