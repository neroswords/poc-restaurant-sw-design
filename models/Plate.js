const mongoose = require('mongoose');

const PlateSchema=new mongoose.Schema({
    price : {
        type : Number,
        required:[true, 'Please add a price']
    },
    status : {
        type:String,
        enum: ['unused','on_belt'],
        default: 'unused'
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

module.exports = mongoose.model('Plate',PlateSchema);