const mongoose = require('mongoose');

const TagSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name'],
        unique: true
    },
    isPublished : {
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

TagSchema.virtual('menu', {
    ref: 'Menu',
    localField: '_id',
    foreignField: 'tags',
    justOne: false
})

module.exports = mongoose.model('Tag', TagSchema);