const mongoose = require('mongoose');

const MenuSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name']
    },
    tags : [{ type : mongoose.Types.ObjectId, ref: 'Tag' }],
    price : {
        type : Number,
        required:[true, 'Please add a price']
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

module.exports = mongoose.model('Menu',MenuSchema);