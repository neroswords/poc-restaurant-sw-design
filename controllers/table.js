const User = require("../models/User");
const Table = require("../models/Table");
const Order = require("../models/Order");
const mongoose = require("mongoose");

//@desc         Get All Table
//@route        GET /api/v1/table
//@access       Public
exports.getTable= async(req, res, next) => {
    const table = await Table.find({});
    res.status(200).json({success:true,data:table});
}

//@desc         Create Table
//@route        POST /api/v1/table
//@access       Private
exports.createTable= async(req, res, next) => {
    const allTables = await Table.find({});
    const tableNumber = allTables.length > 0 ? allTables[allTables.length-1].tableNumber + 1 : 1;
    const user = await User.create({
        name : `table${tableNumber}`,
        email : `table${tableNumber}@mail.com`,
        password: '12345678',
        role : 'customer',
    });
    const table = await Table.create({
        tableNumber : tableNumber,
        status : 'inactive',
        user : user,
    });
    res.status(200).json({success:true,data:table});
}

//@desc         Active Table
//@route        POST /api/v1/table/{tableNumber}/activate
//@access       Private
exports.activeTable= async(req, res, next) => {
    const table = await Table.findOneAndUpdate({tableNumber : req.params.tableNumber}, {status : 'active'});
    res.status(200).json({success:true,data:table});
}

exports.closeTable= async(req, res, next) => {
    const table = await Table.findOne({tableNumber : req.params.tableNumber});
    const order = await Order.findOne({user: table.user._id, status: 'on_going'});
    if (order && order.foodOrder && order.foodOrder.length > 0){
        await Order.updateOne({user: table.user._id, status: 'on_going'}, {status: 'paid'});
    }
    await Table.updateOne({tableNumber : req.params.tableNumber}, {status : 'inactive'});
    res.status(200).json({success:true,message:"no order in this table"});
}

exports.postAddOrderToTableNumber = async(req, res, next) => {
    const table = await Table.findOne({tableNumber : req.params.tableNumber, status : 'active'});
    if (!table) {
        res.status(400).json({success:false,message:"table not active"});
    }
    var foodOrder = []
    const inputOrders = req.body.orders
    for (const inputFoodId of inputOrders){
        foodOrder.push({food: new mongoose.Types.ObjectId(inputFoodId), status : 'todo'})
    }
    
    var updateQuery = {$push: { foodOrder: foodOrder }, $set: {user: table.user._id, status : 'on_going'},}
    const order = await Order.findOneAndUpdate({user: table.user._id, status: 'on_going'}, updateQuery, {upsert: true});
    // if (order && order.foodOrder && order.foodOrder.length > 0){
    //     console.log('cal');
    //     return;
    // }
    // await Table.updateOne({tableNumber : req.params.tableNumber}, {status : 'inactive'});
    res.status(200).json({success:true,data:null});
}

exports.getAllOrderFromTableNumber= async(req, res, next) => {
    const table = await Table.findOne({tableNumber : req.params.tableNumber});
    const order = await Order.findOne({user: table.user._id, status: 'on_going'}).populate({
        path: 'foodOrder',
        populate: { path: 'food' , select :"name tags price"}
    });;
    // if (order && order.foodOrder && order.foodOrder.length > 0){
    //     console.log('cal');
    //     return;
    // }
    // await Table.updateOne({tableNumber : req.params.tableNumber}, {status : 'inactive'});
    res.status(200).json({success:true,data:order});
}