const Menu = require("../models/Menu");
const Tag = require("../models/Tags");
const mongoose = require("mongoose");

//@desc         Get All Menu
//@route        GET /api/v1/menu
//@access       Public
exports.getMenu= async(req, res, next) => {
    const menu = await Menu.find({}).populate({path: 'tags'});
    res.status(200).json({success:true,data:menu});
}

//@desc         Create New Tag
//@route        POST /api/v1/menu/tags
//@access       Private 
exports.createTag= async(req, res, next) => {
    try {
        const { name } = req.body;
        const tag = await Tag.create({
            name,
        });
        res.status(201).json({success: true, data: tag});
    } catch (err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}

//@desc         Create New Menu
//@route        POST /api/v1/menu
//@access       Private
exports.createMenu= async(req, res, next) => {
    try {
        const { name, price, tags, food_type} = req.body;
        const objectIdTagArray = tags.map(tagId => new mongoose.Types.ObjectId(tagId));
        const menu = await Menu.create({
            name : name,
            tags : objectIdTagArray,
            price : price,
            food_type : food_type
        });
        res.status(201).json({success: true, data: menu});
    } catch (err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}