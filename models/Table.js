const mongoose = require('mongoose');

const TableSchema=new mongoose.Schema({
    tableNumber:{
        type:Number,
        required:[true, 'Please add a table number'],
        unique:true,
    },
    status : {
        type:String,
        enum: ['active','inactive'],
        default: 'active'
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Table',TableSchema);