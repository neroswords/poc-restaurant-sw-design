const mongoose = require('mongoose');

const SessionBillSchema=new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    normalOrder:[{
            type : mongoose.Schema.ObjectId,
            ref : 'Plate',
            required : true
    }],
    speacailOrder : [{
            type : mongoose.Schema.ObjectId,
            ref : 'Menu',
            required : true
    }],
    total : {
        type : Number,
        required : true,
        default : 0
    },
    status : {
        type:String,
        enum: ['on_going', 'paid'],
        default: 'on_going'
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

module.exports = mongoose.model('SessionBill',SessionBillSchema);