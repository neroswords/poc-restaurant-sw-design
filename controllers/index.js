const Tag = require("../models/Tags");
const Menu = require("../models/Menu");
const Table = require("../models/Table");
//@desc         Get index for customer
//@route        GET /
//@access       Public
exports.getIndexPage = async (req, res, next) => {
    const table = await Table.findOne({user:req.user.id})
    const tags = await Tag.find().populate({
        path: 'menu',
        select: 'name'
    });
    if(tags.length == 0) {
        return res.status(500).json({success:false, message: "no tag found"});
    }
    let food_type = req.query.type;
    let tag = tags[0];
    if (food_type) {
        tag = await Tag.findOne({ name: food_type}).populate({
            path: 'menu',
            select: 'name'
        });
    }
    const menu = await Menu.find({}).populate({path: 'tags'});
    res.render('pages/customer_landing', { tags : tags, query_tag : tag, menu: menu, table:table});
}

//@desc         Get Login  Page
//@route        GET /login
//@access       Public
exports.getLogin = async (req, res, next) => {
    res.render('pages/login_page');
}

exports.getTableManagementPage = async (req, res, next) => {
    const tables = await Table.find();
    res.render('pages/table_management', {tables});
}

exports.getOrderStatusPage = async (req, res, next) => {
    res.render('pages/order_status');
}