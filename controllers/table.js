const User = require("../models/User");
const Table = require("../models/Table");
const Order = require("../models/Order");
const SessionBill = require("../models/SessionBill");
const DeliveredLog = require("../models/DeliveredLog");
const Menu = require("../models/Menu");

const mongoose = require("mongoose");
const e = require("express");
const Plate = require("../models/Plate");

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
////////////////////////////////////////////////////////////////////////
exports.createBill = async(req, res, next) => {
    const { normalOrder, speacailOrder } = req.body;
    const table = await Table.findOne({tableNumber : req.params.tableNumber, status: 'active'});
    if (!table) {
        return res.status(400).json({success:false, msg: "table not found"});
    }
    const objectIdNormalOrderArray = normalOrder.map(id => new mongoose.Types.ObjectId(id));
    const objectIdSpeacailOrderArray = speacailOrder.map(id => new mongoose.Types.ObjectId(id));

    const plates = await Plate.find({ _id: { $in: objectIdNormalOrderArray } });
    const totalNormalOrderPrice = plates.reduce((total, plate) => total + plate.price, 0);

    const menus = await Menu.find({ _id: { $in: objectIdSpeacailOrderArray } });
    const totalSpeacailOrderPrice = menus.reduce((total, menu) => total + menu.price, 0);

    const session_bill = await SessionBill.findOneAndUpdate({user: table.user._id, status: 'on_going'},{
        user: table.user._id,
        normalOrder: objectIdNormalOrderArray,
        speacailOrder: objectIdSpeacailOrderArray,
        total: totalNormalOrderPrice+totalSpeacailOrderPrice,
        status: 'on_going',
    }, {upsert: true, returnNewDocument: true})
    res.status(200).json({success:true, data: session_bill});
}

exports.payBill = async (req, res, next) => {
    try {
        const bill = await SessionBill.findOne({ _id: new mongoose.Types.ObjectId(req.body.session_id), status: 'on_going'})
        if (req.body.amount){
            if (bill.total > req.body.amount){
                return res.status(400).json({success:false, msg : "not enough money input"});
            }
            var change = req.body.amount - bill.total
        }
        await SessionBill.updateOne({ _id: new mongoose.Types.ObjectId(req.body.session_id), status: 'on_going'}, {status: 'paid'})
        await Table.updateOne({user : bill.user._id}, {status : 'inactive'});
    } catch (err) {
        return res.status(400).json({success:false, msg : "something went wrong"});
    }
    res.status(200).json({success:true,message:"print bill...", data : {change : change}});
}

exports.deliverPlate = async (req, res, next) => {
    const table = await Table.findOne({tableNumber : req.body.tableNumber, status : 'active'});
    if (!table) {
        return res.status(400).json({success:false, msg: "table not found"});
    }
    await DeliveredLog.create({
        user : table.user._id,
        plate : new mongoose.Types.ObjectId(req.body.plateId),
        menu : new mongoose.Types.ObjectId(req.body.menuId),
        status : 'on_going',
    })
    res.status(200).json({success:true,msg:'success'});
}

exports.deliveredTrigger = async (req, res, next) => {
    const table = await Table.findOne({tableNumber : req.body.tableNumber, status : 'active'});
    if (!table) {
        return res.status(400).json({success:false});
    }
    await DeliveredLog.updateOne({user : table.user._id,plate : new mongoose.Types.ObjectId(req.body.plateId),},{status : 'delivered'})
    res.status(200).json({success:true,msg:'success'});
}

exports.addPlate= async(req, res, next) => {
    const plate = await Plate.create({
        price : req.body.price,
    })
    res.status(200).json({success:true,data:plate});
}
////////////////////////////////////////////////////////////////////////
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
        populate: { path: 'food' , select :"name tags price img"}
    });;
    // if (order && order.foodOrder && order.foodOrder.length > 0){
    //     console.log('cal');
    //     return;
    // }
    // await Table.updateOne({tableNumber : req.params.tableNumber}, {status : 'inactive'});
    res.status(200).json({success:true,data:order});
}

